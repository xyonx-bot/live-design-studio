import pytest

from app.services import canvases as cv


@pytest.fixture
async def canvas(client, auth):
    r = await client.post("/api/canvases", headers=auth, json={"name": "variants-test"})
    cid = r.json()["id"]
    return cid


@pytest.mark.asyncio
async def test_list_pieces_groups_variants(client, auth, canvas):
    from pathlib import Path
    import os

    d = cv._dir(canvas) / "src" / "components"
    d.mkdir(parents=True, exist_ok=True)
    (d / "Button.preview.tsx").write_text("export default () => <button>canonical</button>")
    (d / "Button.rounded.preview.tsx").write_text("export default () => <button>rounded</button>")
    (d / "Button.square.preview.tsx").write_text("export default () => <button>square</button>")

    pieces = cv.list_pieces(canvas)
    assert len(pieces) == 1
    p = pieces[0]
    assert p["name"] == "Button"
    assert p["group"] == "components"
    assert p["file"] == "Button.preview.tsx"           # canonical picked
    assert {v["variant"] for v in p["variants"]} == {"default", "rounded", "square"}
    variants_files = {v["variant"]: v["file"] for v in p["variants"]}
    assert variants_files["rounded"] == "Button.rounded.preview.tsx"


@pytest.mark.asyncio
async def test_keep_variant_promotes_and_archives(client, auth, canvas):
    from pathlib import Path
    d = cv._dir(canvas) / "src" / "components"
    d.mkdir(parents=True, exist_ok=True)
    (d / "Button.preview.tsx").write_text("canonical")
    (d / "Button.rounded.preview.tsx").write_text("rounded")
    (d / "Button.square.preview.tsx").write_text("square")

    out = cv.keep_variant(canvas, "components", "Button", "square")
    assert out["ok"] is True
    assert out["canonical"] == "Button.preview.tsx"
    assert (d / "Button.preview.tsx").read_text() == "square"
    # old canonical + remaining non-kept variants moved to _archived
    archived = d / "_archived"
    assert archived.exists()
    archived_names = [f.name for f in archived.iterdir()]
    assert any("Button.preview.tsx" in n for n in archived_names)
    assert any("Button.rounded.preview.tsx" in n for n in archived_names)
    # no variant files left at the group level for Button.tsx
    assert not list(d.glob("Button.*.preview.tsx"))


@pytest.mark.asyncio
async def test_keep_variant_default_is_noop(client, auth, canvas):
    from pathlib import Path
    d = cv._dir(canvas) / "src" / "components"
    d.mkdir(parents=True, exist_ok=True)
    (d / "Button.preview.tsx").write_text("canonical")
    out = cv.keep_variant(canvas, "components", "Button", "default")
    assert out["ok"] is True and out.get("unchanged") is True


@pytest.mark.asyncio
async def test_keep_variant_missing_404(client, auth, canvas):
    with pytest.raises(FileNotFoundError):
        cv.keep_variant(canvas, "components", "Ghost", "abc")


@pytest.mark.asyncio
async def test_keep_endpoint_route(client, auth, canvas):
    from pathlib import Path
    d = cv._dir(canvas) / "src" / "components"
    d.mkdir(parents=True, exist_ok=True)
    (d / "Button.preview.tsx").write_text("canonical")
    (d / "Button.rounded.preview.tsx").write_text("rounded")

    r = await client.post(f"/api/canvases/{canvas}/pieces/components/Button/keep",
                          headers=auth, json={"variant": "rounded"})
    assert r.status_code == 200
    assert r.json()["ok"] is True
    assert (d / "Button.preview.tsx").read_text() == "rounded"
