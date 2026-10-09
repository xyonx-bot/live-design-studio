import json
import os
import re
import shutil
from pathlib import Path
from typing import List, Optional
from datetime import datetime
from app.core.config import get_settings

settings = get_settings()

_CANVASES_DIR = Path(settings.WORKSPACE_PATH) / "canvases"
_DEFAULT = "default"
_ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")


def _dir(canvas_id: str) -> Path:
    if not _ID_RE.match(canvas_id):
        raise ValueError("Invalid canvas id")
    return _CANVASES_DIR / canvas_id


def _meta_path(canvas_id: str) -> Path:
    return _dir(canvas_id) / "meta.json"


def _read_meta(canvas_id: str) -> dict:
    p = _meta_path(canvas_id)
    if p.exists():
        return json.loads(p.read_text())
    return {"id": canvas_id, "name": canvas_id, "session_id": None, "archived": False,
            "created_at": datetime.utcnow().isoformat()}


def _write_meta(canvas_id: str, meta: dict) -> None:
    d = _dir(canvas_id)
    d.mkdir(parents=True, exist_ok=True)
    (d / "meta.json").write_text(json.dumps(meta, indent=2))


_TEMPLATE = _CANVASES_DIR / "_template"


def _scaffold(canvas_id: str) -> None:
    """Seed from _template (bare min: tokens/globals.css, lib/utils.ts, tailwind.config.js,
    empty components/sections/layout dirs). Agent writes pieces; no build scaffold here."""
    d = _dir(canvas_id)
    if _TEMPLATE.exists():
        shutil.copytree(_TEMPLATE, d, dirs_exist_ok=True)
    else:
        for group in ("components", "sections", "layout", "styles", "lib"):
            (d / "src" / group).mkdir(parents=True, exist_ok=True)
        gcss = d / "src" / "styles" / "globals.css"
        if not gcss.exists():
            gcss.write_text("/* design tokens for this canvas */\n:root {\n  --radius: 0.4rem;\n}\n")


def list_canvases() -> List[dict]:
    _CANVASES_DIR.mkdir(parents=True, exist_ok=True)
    if not (_CANVASES_DIR / _DEFAULT).exists():
        _scaffold(_DEFAULT)
        _write_meta(_DEFAULT, {"id": _DEFAULT, "name": "Default", "session_id": None,
                               "archived": False, "created_at": datetime.utcnow().isoformat()})
    out = []
    for child in sorted(_CANVASES_DIR.iterdir()):
        if child.is_dir() and _ID_RE.match(child.name) and not child.name.startswith("_"):
            try:
                out.append(_read_meta(child.name))
            except Exception:
                continue
    return out


def get_canvas(canvas_id: str) -> dict:
    if not _dir(canvas_id).exists():
        raise FileNotFoundError(canvas_id)
    return _read_meta(canvas_id)


def create_canvas(name: str) -> dict:
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "canvas"
    canvas_id = base
    i = 2
    while _dir(canvas_id).exists():
        canvas_id = f"{base}-{i}"
        i += 1
    _scaffold(canvas_id)
    meta = {"id": canvas_id, "name": name, "session_id": None, "archived": False,
            "created_at": datetime.utcnow().isoformat()}
    _write_meta(canvas_id, meta)
    return meta


def set_archived(canvas_id: str, archived: bool) -> dict:
    meta = get_canvas(canvas_id)
    meta["archived"] = archived
    _write_meta(canvas_id, meta)
    return meta


def delete_canvas(canvas_id: str) -> bool:
    if canvas_id == _DEFAULT:
        raise ValueError("Cannot delete the default canvas")
    d = _dir(canvas_id)
    if d.exists():
        shutil.rmtree(d)
        return True
    return False


def set_session(canvas_id: str, session_id: Optional[str]) -> dict:
    meta = get_canvas(canvas_id)
    meta["session_id"] = session_id
    _write_meta(canvas_id, meta)
    return meta


def set_model(canvas_id: str, model: Optional[str]) -> dict:
    meta = get_canvas(canvas_id)
    meta["model"] = model
    _write_meta(canvas_id, meta)
    return meta


def get_model(canvas_id: str) -> Optional[str]:
    return _read_meta(canvas_id).get("model")


def set_provider_model(canvas_id: str, provider: str, model: str) -> dict:
    meta = get_canvas(canvas_id)
    meta["provider"] = provider
    meta["model"] = model
    _write_meta(canvas_id, meta)
    return meta


def get_provider_model(canvas_id: str) -> Optional[dict]:
    meta = _read_meta(canvas_id)
    if meta.get("provider") and meta.get("model"):
        return {"provider": meta["provider"], "model": meta["model"]}
    return None


def _history_path(canvas_id: str) -> Path:
    return _dir(canvas_id) / "chat.json"


def load_history(canvas_id: str) -> List[dict]:
    p = _history_path(canvas_id)
    if p.exists():
        try:
            return json.loads(p.read_text())
        except Exception:
            return []
    return []


def append_history(canvas_id: str, role: str, content: str, image_url: Optional[str] = None) -> None:
    hist = load_history(canvas_id)
    entry = {"role": role, "content": content, "timestamp": datetime.utcnow().isoformat()}
    if image_url:
        entry["image_url"] = image_url
    hist.append(entry)
    _history_path(canvas_id).write_text(json.dumps(hist, indent=2))


def clear_history(canvas_id: str) -> None:
    p = _history_path(canvas_id)
    if p.exists():
        p.unlink()


_PIECE_RE = re.compile(r"^(?P<name>.+?)(?:\.(?P<variant>[a-z0-9]+))?\.preview\.(?P<kind>tsx|jsx)$")
_PIECE_HTML_RE = re.compile(r"^(?P<name>.+?)(?:\.(?P<variant>[a-z0-9]+))?\.preview\.html$")


def _parse_piece_filename(fname: str) -> Optional[dict]:
    m = _PIECE_RE.match(fname)
    if m:
        return {"name": m.group("name"), "variant": m.group("variant") or "default",
                "kind": m.group("kind"), "file": fname}
    m = _PIECE_HTML_RE.match(fname)
    if m:
        return {"name": m.group("name"), "variant": m.group("variant") or "default",
                "kind": "html", "file": fname}
    return None


def list_pieces(canvas_id: str) -> List[dict]:
    """Return [{name, group, file, kind, variant, variants:[{variant,file,kind}], isCanonical}] for every piece under the canvas.

    Variants are files like Button.rounded.preview.tsx next to canonical Button.preview.tsx.
    A piece with variants exposes them under .variants; canonical is the one without a variant suffix.
    """
    d = _dir(canvas_id)
    flat: List[dict] = []
    for group in ("components", "sections", "layout"):
        gdir = d / "src" / group
        if not gdir.exists():
            continue
        for f in sorted(gdir.iterdir()):
            if not f.is_file():
                continue
            # raw (non-preview) html piece
            if f.suffix == ".html" and not f.name.endswith(".preview.html"):
                flat.append({"name": f.stem, "group": group, "file": f.name, "kind": "html",
                             "variant": "default"})
                continue
            info = _parse_piece_filename(f.name)
            if info:
                flat.append({"name": info["name"], "group": group, "file": info["file"],
                             "kind": info["kind"], "variant": info["variant"]})

    # Group by (name, group)
    out: dict = {}
    for p in flat:
        key = (p["group"], p["name"])
        bucket = out.setdefault(key, [])
        bucket.append(p)

    pieces: List[dict] = []
    for (group, name), bucket in out.items():
        bucket.sort(key=lambda b: (b["variant"] != "default", b["variant"]))
        canonical = next((b for b in bucket if b["variant"] == "default"), None)
        if canonical is None:
            canonical = bucket[0]
        pieces.append({
            "name": name,
            "group": group,
            "file": canonical["file"],
            "kind": canonical["kind"],
            "variant": "default",
            "variants": [
                {"variant": b["variant"], "file": b["file"], "kind": b["kind"]} for b in bucket
            ],
        })
    pieces.sort(key=lambda p: (p["group"], p["name"]))
    return pieces


def keep_variant(canvas_id: str, group: str, name: str, variant: str) -> dict:
    """Promote `variant` file to canonical `<name>.preview.<ext>`. Archived canonical goes to _archived/<ts>-<file>."""
    d = _dir(canvas_id) / "src" / group
    if not d.exists():
        raise FileNotFoundError(f"Group {group} not found")
    if variant == "default":
        return {"ok": True, "unchanged": True}

    src = None
    for ext in ("tsx", "jsx", "html"):
        cand = d / f"{name}.{variant}.preview.{ext}"
        if cand.exists():
            src = cand
            break
    if src is None:
        raise FileNotFoundError(f"Variant {variant} not found for {group}/{name}")

    ext = src.suffix.lstrip(".")
    canonical = d / f"{name}.preview.{ext}"
    archived = d / "_archived"
    archived.mkdir(exist_ok=True)
    if canonical.exists():
        canonical.rename(archived / f"{int(datetime.utcnow().timestamp())}-{canonical.name}")
    src.rename(canonical)
    # Remove any other variants of same ext (they are superseded); keep diverse-ext ones
    for f in list(d.glob(f"{name}.*.preview.{ext}")):
        if f.name != f"{name}.preview.{ext}" and f.parent != archived:
            f.rename(archived / f"{int(datetime.utcnow().timestamp())}-{f.name}")
    return {"ok": True, "canonical": canonical.name, "archived_dir": "_archived"}


def resolve_piece_file(canvas_id: str, group: str, name: str, variant: Optional[str] = None) -> Optional[Path]:
    """Find the preview file for a piece (any supported kind). variant=None→canonical."""
    d = _dir(canvas_id) / "src" / group
    if not d.exists():
        return None
    if variant and variant != "default":
        for cand in (f"{name}.{variant}.preview.tsx", f"{name}.{variant}.preview.jsx", f"{name}.{variant}.preview.html"):
            p = d / cand
            if p.exists():
                return p
        return None
    for cand in (f"{name}.preview.tsx", f"{name}.preview.jsx", f"{name}.preview.html", f"{name}.html"):
        p = d / cand
        if p.exists():
            return p
    return None
