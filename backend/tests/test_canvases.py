import pytest

from tests.conftest import CANVAS


@pytest.mark.asyncio
async def test_list_canvases_has_default(client, auth):
    r = await client.get("/api/canvases", headers=auth)
    assert r.status_code == 200
    ids = [c["id"] for c in r.json()]
    assert "default" in ids


@pytest.mark.asyncio
async def test_create_get_archive_delete_canvas(client, auth):
    # create
    r = await client.post("/api/canvases", headers=auth, json={"name": CANVAS})
    assert r.status_code == 200, r.text
    canvas_id = r.json()["id"]

    # meta
    r = await client.get(f"/api/canvases/{canvas_id}/meta", headers=auth)
    assert r.status_code == 200
    assert r.json()["name"] == CANVAS
    assert r.json()["archived"] is False

    # archive
    r = await client.post(f"/api/canvases/{canvas_id}/archive", headers=auth)
    assert r.status_code == 200
    assert r.json()["archived"] is True

    # delete
    r = await client.delete(f"/api/canvases/{canvas_id}", headers=auth)
    assert r.status_code == 200
    r = await client.get(f"/api/canvases/{canvas_id}/meta", headers=auth)
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_canvas_meta_unknown_404(client, auth):
    r = await client.get("/api/canvases/does-not-exist/meta", headers=auth)
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_pieces_and_history_empty_canvas(client, auth):
    r = await client.post("/api/canvases", headers=auth, json={"name": CANVAS + "-p"})
    canvas_id = r.json()["id"]
    r = await client.get(f"/api/canvases/{canvas_id}/pieces", headers=auth)
    assert r.status_code == 200
    assert r.json() == []
    r = await client.get(f"/api/canvases/{canvas_id}/history", headers=auth)
    assert r.status_code == 200
    assert r.json()["history"] == []
    assert r.json()["running_job"] is None
    await client.delete(f"/api/canvases/{canvas_id}", headers=auth)


@pytest.mark.asyncio
async def test_cannot_delete_default_canvas(client, auth):
    r = await client.delete("/api/canvases/default", headers=auth)
    assert r.status_code in (400, 422)
