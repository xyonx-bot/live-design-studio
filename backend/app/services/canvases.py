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


def _scaffold(canvas_id: str) -> None:
    d = _dir(canvas_id)
    for group in ("components", "sections", "layout", "styles"):
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
        if child.is_dir() and _ID_RE.match(child.name):
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


def append_history(canvas_id: str, role: str, content: str) -> None:
    hist = load_history(canvas_id)
    hist.append({"role": role, "content": content, "timestamp": datetime.utcnow().isoformat()})
    _history_path(canvas_id).write_text(json.dumps(hist, indent=2))


def clear_history(canvas_id: str) -> None:
    p = _history_path(canvas_id)
    if p.exists():
        p.unlink()


_PIECE_RE = re.compile(r"^(?P<name>.+)\.preview\.(tsx|jsx)$")


def list_pieces(canvas_id: str) -> List[dict]:
    """Return [{name, group, file, kind}] for every preview/jsx/html file under the canvas."""
    d = _dir(canvas_id)
    pieces: List[dict] = []
    for group in ("components", "sections", "layout"):
        gdir = d / "src" / group
        if not gdir.exists():
            continue
        for f in sorted(gdir.iterdir()):
            if not f.is_file():
                continue
            # raw html piece
            if f.suffix == ".html" and not f.name.endswith(".preview.html"):
                pieces.append({"name": f.stem, "group": group, "file": f.name, "kind": "html"})
                continue
            m = _PIECE_RE.match(f.name)
            if m:
                pieces.append({"name": m.group("name"), "group": group, "file": f.name,
                               "kind": f.suffix.lstrip(".")})
                continue
            if f.suffix == ".html" and f.name.endswith(".preview.html"):
                pieces.append({"name": f.name[:-len(".preview.html")], "group": group,
                               "file": f.name, "kind": "html"})
    return pieces


def resolve_piece_file(canvas_id: str, group: str, name: str) -> Optional[Path]:
    """Find the preview file for a piece (any supported kind)."""
    d = _dir(canvas_id) / group
    if not d.exists():
        return None
    for cand in (f"{name}.preview.tsx", f"{name}.preview.jsx", f"{name}.preview.html", f"{name}.html"):
        p = d / cand
        if p.exists():
            return p
    return None
