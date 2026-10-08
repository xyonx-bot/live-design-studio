import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


async def _client():
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")


@pytest.mark.asyncio
async def test_login_ok():
    async with await _client() as c:
        r = await c.post("/api/auth/login", data={"username": "admin", "password": "test-pass"})
    assert r.status_code == 200
    body = r.json()
    assert body["access_token"]
    assert body["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password():
    async with await _client() as c:
        r = await c.post("/api/auth/login", data={"username": "admin", "password": "nope"})
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_protected_routes_require_token():
    async with await _client() as c:
        assert (await c.get("/api/canvases")).status_code == 401
        assert (await c.get("/api/auth/me")).status_code == 401
        assert (await c.post("/api/chat", json={"message": "hi"})).status_code == 401


@pytest.mark.asyncio
async def test_me(client, auth):
    r = await client.get("/api/auth/me", headers=auth)
    assert r.status_code == 200
    assert r.json()["username"] == "admin"


@pytest.mark.asyncio
async def test_ws_requires_token(client):
    from starlette.testclient import TestClient
    # Sync TestClient is simplest for websocket auth checks
    tc = TestClient(app)
    with pytest.raises(Exception):  # rejected before upgrade completes
        with tc.websocket_connect("/api/ws"):
            pass
