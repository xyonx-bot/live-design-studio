import os
import uuid

import pytest
from httpx import ASGITransport, AsyncClient

# Isolate to a temp canvas workspace BEFORE importing app (settings are cached).
os.environ.setdefault("WORKSPACE_PATH", "/tmp/lds-test-ws")
os.environ.setdefault("SECRET_KEY", "test-secret")
os.environ.setdefault("ADMIN_USERNAME", "admin")
os.environ.setdefault("ADMIN_PASSWORD", "test-pass")

from app.main import app  # noqa: E402

CANVAS = f"t-{uuid.uuid4().hex[:8]}"


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest.fixture
async def token(client):
    r = await client.post("/api/auth/login", data={"username": "admin", "password": "test-pass"})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture
def auth(token):
    return {"Authorization": f"Bearer {token}"}
