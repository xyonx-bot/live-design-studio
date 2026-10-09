import asyncio
import json

import pytest

from tests.conftest import CANVAS


@pytest.mark.asyncio
async def test_chat_returns_job_and_persists_history(client, auth, monkeypatch):
    r = await client.post("/api/canvases", headers=auth, json={"name": CANVAS + "-chat"})
    canvas_id = r.json()["id"]

    # Mock the Hermes call: swap httpx.AsyncClient with a shim whose post returns a canned completion.
    class FakeResponse:
        def raise_for_status(self): pass
        def json(self):
            return {"choices": [{"message": {"content": "MOCK_REPLY"}}]}

    class FakeClient:
        def __init__(self, *a, **kw): pass
        async def __aenter__(self): return self
        async def __aexit__(self, *a): return False
        async def post(self, url, **kw):
            assert "/v1/chat/completions" in url
            return FakeResponse()

    import app.api.routes as routes
    monkeypatch.setattr(routes.httpx, "AsyncClient", FakeClient)

    r = await client.post("/api/chat", headers=auth,
                          json={"message": "hello", "canvas_id": canvas_id})
    assert r.status_code == 200, r.text
    job_id = r.json()["session_id"]
    assert job_id

    # Poll until job finishes
    reply = None
    for _ in range(50):
        await asyncio.sleep(0.05)
        r = await client.get(f"/api/chat/jobs/{job_id}", headers=auth)
        job = r.json()
        if job["status"] in ("done", "error"):
            reply = job["response"]
            break
    assert reply == "MOCK_REPLY"

    # History persisted per-canvas — endpoint returns {history, session_id, model, running_job}
    r = await client.get(f"/api/canvases/{canvas_id}/history", headers=auth)
    hist = r.json()["history"]
    assert any(h["role"] == "user" and h["content"] == "hello" for h in hist)
    assert any(h["role"] == "assistant" and h["content"] == "MOCK_REPLY" for h in hist)

@pytest.mark.asyncio
async def test_chat_routes_to_canvas_provider(client, auth, monkeypatch):
    """Set canvas to a non-default provider and verify the chat uses that base_url."""
    r = await client.post("/api/canvases", headers=auth, json={"name": CANVAS + "-prov"})
    canvas_id = r.json()["id"]

    # set provider/model for the canvas
    await client.post(f"/api/canvases/{canvas_id}/provider-model", headers=auth,
                      json={"provider": "openrouter", "model": "moonshotai/kimi-k3"})

    called = {"url": None, "key": None}
    class FakeResponse:
        def raise_for_status(self): pass
        def json(self): return {"choices": [{"message": {"content": "OK"}}]}
    class FakeClient:
        def __init__(self, *a, **kw): pass
        async def __aenter__(self): return self
        async def __aexit__(self, *a): return False
        async def post(self, url, json=None, headers=None, **kw):
            called["url"] = url
            called["key"] = (headers or {}).get("Authorization")
            called["model"] = (json or {}).get("model")
            return FakeResponse()
    import app.api.routes as routes
    monkeypatch.setattr(routes.httpx, "AsyncClient", FakeClient)

    r = await client.post("/api/chat", headers=auth,
                          json={"message": "hi", "canvas_id": canvas_id})
    assert r.status_code == 200
    # wait for bg task
    import asyncio
    await asyncio.sleep(0.05)
    # let the task finish
    for _ in range(60):
        await asyncio.sleep(0.05)
        job_id = r.json()["session_id"]
        jr = await client.get(f"/api/chat/jobs/{job_id}", headers=auth)
        if jr.json()["status"] != "running":
            break
    assert called["url"] is not None and called["url"].endswith("/v1/chat/completions")
    assert called["url"].startswith("https://openrouter.ai/api/v1"), called["url"]
    assert called["model"] == "moonshotai/kimi-k3"

    await client.delete(f"/api/canvases/{canvas_id}", headers=auth)
