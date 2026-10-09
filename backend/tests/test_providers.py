import pytest

from tests.conftest import CANVAS


@pytest.mark.asyncio
async def test_list_providers_shape(client, auth):
    r = await client.get("/api/model-providers", headers=auth)
    assert r.status_code == 200
    providers = r.json()
    ids = {p["id"] for p in providers}
    assert ids == {"openrouter", "nvidia"}   # only these two (no hermes-default, no custom)
    for p in providers:
        assert "label" in p and "requires_key" in p and "has_key" in p and "can_probe" in p


@pytest.mark.asyncio
async def test_set_get_provider_model(client, auth):
    r = await client.post("/api/canvases", headers=auth, json={"name": CANVAS + "-model"})
    cid = r.json()["id"]

    # default returns Mira's default
    r = await client.get(f"/api/canvases/{cid}/provider-model", headers=auth)
    assert r.status_code == 200
    assert r.json()["provider"] == "nvidia"
    assert r.json()["model"] == "moonshotai/kimi-k3"

    # set + get round-trip
    r = await client.post(f"/api/canvases/{cid}/provider-model", headers=auth,
                          json={"provider": "openrouter", "model": "anthropic/claude-sonnet-4"})
    assert r.status_code == 200
    assert r.json()["ok"] is True

    r = await client.get(f"/api/canvases/{cid}/provider-model", headers=auth)
    assert r.json() == {"provider": "openrouter", "model": "anthropic/claude-sonnet-4"}

    # unknown provider → 400
    r = await client.post(f"/api/canvases/{cid}/provider-model", headers=auth,
                          json={"provider": "notaone", "model": "x"})
    assert r.status_code == 400

    await client.delete(f"/api/canvases/{cid}", headers=auth)


@pytest.mark.asyncio
async def test_validate_model_hermes_default_no_auth_vs_http(client, auth, monkeypatch):
    """/model-providers/validate should not blow up — it returns a dict with valid and optional error."""
    import app.api.routes as routes

    class FakeResp:
        def raise_for_status(self): pass
        def json(self): return {"data": [{"id": "hermes-agent"}, {"id": "other-model"}]}
    class FakeClient:
        def __init__(self, *a, **k): pass
        async def __aenter__(self): return self
        async def __aexit__(self, *a): return False
        async def get(self, url, **kw): return FakeResp()
    monkeypatch.setattr(routes.httpx, "AsyncClient", FakeClient)

    r = await client.post("/api/model-providers/validate", headers=auth,
                          json={"provider": "nvidia", "model": "hermes-agent"})
    assert r.status_code == 200
    assert r.json()["valid"] is True

    r = await client.post("/api/model-providers/validate", headers=auth,
                          json={"provider": "nvidia", "model": "nope"})
    assert r.json()["valid"] is False
    assert "available_models" in r.json()
