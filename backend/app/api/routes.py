from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional
from pydantic import BaseModel
from app.core.config import get_settings
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from app.models.schemas import Token, FileItem, FileContent, FileWrite, FileEdit, CommitRequest, CommitResponse
from app.services.workspace import workspace_service
from app.services.websocket import manager
import os
import httpx

settings = get_settings()
router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ── Auth: single admin user from env, JWT-issued. No open registration. ──────
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")


def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    username = payload.get("sub")
    if username != ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="User not found")
    return {"username": username}


@router.post("/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if not ADMIN_PASSWORD:
        raise HTTPException(status_code=503, detail="Auth not configured on server")
    if form_data.username != ADMIN_USERNAME or form_data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": ADMIN_USERNAME})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return {"username": current_user["username"]}


# ── File operations ───────────────────────────────────────────────────────────
@router.get("/files", response_model=List[FileItem])
async def list_files(path: str = "", current_user: dict = Depends(get_current_user)):
    return workspace_service.list_files(path)


@router.get("/files/content", response_model=FileContent)
async def read_file(path: str, current_user: dict = Depends(get_current_user)):
    try:
        content = workspace_service.read_file(path)
        return {"path": path, "content": content}
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/files", response_model=FileContent)
async def write_file(file: FileWrite, current_user: dict = Depends(get_current_user)):
    try:
        path = workspace_service.write_file(file.path, file.content)
        await manager.broadcast_event("file_changed", {"path": path, "action": "write"})
        return {"path": path, "content": file.content}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/files", response_model=FileContent)
async def edit_file(file: FileEdit, current_user: dict = Depends(get_current_user)):
    try:
        path = workspace_service.edit_file(file.path, file.old_string, file.new_string, file.replace_all)
        content = workspace_service.read_file(path)
        await manager.broadcast_event("file_changed", {"path": path, "action": "edit"})
        return {"path": path, "content": content}
    except (FileNotFoundError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/files")
async def delete_file(path: str, current_user: dict = Depends(get_current_user)):
    success = workspace_service.delete_file(path)
    if success:
        await manager.broadcast_event("file_changed", {"path": path, "action": "delete"})
    return {"success": success}


# ── Components ────────────────────────────────────────────────────────────────
@router.get("/components", response_model=List[str])
async def list_components(current_user: dict = Depends(get_current_user)):
    return workspace_service.list_components()


# ── Git ───────────────────────────────────────────────────────────────────────
@router.post("/git/commit", response_model=CommitResponse)
async def commit(commit_req: CommitRequest, current_user: dict = Depends(get_current_user)):
    result = workspace_service.commit(commit_req.message)
    await manager.broadcast_event("git_commit", {"sha": result.sha, "message": result.message})
    return result


@router.get("/git/history", response_model=List[CommitResponse])
async def git_history(limit: int = 50, current_user: dict = Depends(get_current_user)):
    return workspace_service.get_history(limit)


@router.post("/git/checkout")
async def git_checkout(sha: str, current_user: dict = Depends(get_current_user)):
    success = workspace_service.checkout(sha)
    if success:
        await manager.broadcast_event("git_checkout", {"sha": sha})
    return {"success": success}


# ── WebSocket (token required) ────────────────────────────────────────────────
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: Optional[str] = None):
    payload = decode_access_token(token) if token else None
    if payload is None or payload.get("sub") != ADMIN_USERNAME:
        await websocket.close(code=4401)
        return
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            await manager.send_personal_message({"type": "ack", "payload": data}, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)


# ── Hermes Agent chat proxy ───────────────────────────────────────────────────
# Hermes api_server is OpenAI-compatible: POST /v1/chat/completions with a
# Bearer API_SERVER_KEY. Same machine, no cookie login, no fake /api/auth/login.
HERMES_AGENT_URL = os.getenv("HERMES_AGENT_URL", "http://172.19.0.1:8644").rstrip("/")
HERMES_API_KEY = os.getenv("HERMES_API_KEY", "")
HERMES_MODEL = os.getenv("HERMES_MODEL", "hermes-agent")

SYSTEM_PROMPT = (
    "You are the build agent inside Live Design Studio, a live-design tool. "
    "The user describes UI components/sections; you create or edit them in the Vite workspace. "
    "Workspace layout: src/components/*.tsx, src/sections/*.tsx, src/layout/*.tsx, each with a "
    "matching *.preview.tsx wrapper that renders the component standalone. "
    "Always create both the component file and its .preview.tsx file. "
    "Use Tailwind classes and the cn() helper from src/lib/utils. Be concise in replies."
)


class ChatMessageIn(BaseModel):
    message: str
    session_id: Optional[str] = None
    history: Optional[List[dict]] = None


class ChatResponse(BaseModel):
    response: str
    session_id: Optional[str] = None
    tools_used: List[str] = []


# Per-session conversation history (OpenAI clients resend history each turn;
# we keep server-side history keyed by session_id so the browser stays thin).
chat_sessions: dict[str, List[dict]] = {}


@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(chat: ChatMessageIn, current_user: dict = Depends(get_current_user)):
    session_id = chat.session_id or os.urandom(8).hex()
    history = chat_sessions.setdefault(session_id, [])
    history.append({"role": "user", "content": chat.message})

    headers = {"Content-Type": "application/json"}
    if HERMES_API_KEY:
        headers["Authorization"] = f"Bearer {HERMES_API_KEY}"

    payload = {
        "model": HERMES_MODEL,
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + history[-40:],
        "stream": False,
    }

    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            resp = await client.post(f"{HERMES_AGENT_URL}/v1/chat/completions", json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()

        reply = (data.get("choices") or [{}])[0].get("message", {}).get("content", "")
        history.append({"role": "assistant", "content": reply})
        return ChatResponse(response=reply or "(empty response)", session_id=session_id, tools_used=[])
    except httpx.HTTPStatusError as e:
        return ChatResponse(
            response=f"Hermes error {e.response.status_code}: {e.response.text[:300]}",
            session_id=session_id,
        )
    except httpx.HTTPError as e:
        return ChatResponse(
            response=f"Cannot reach Hermes at {HERMES_AGENT_URL}: {e}",
            session_id=session_id,
        )


@router.post("/chat/reset")
async def reset_chat(session_id: str, current_user: dict = Depends(get_current_user)):
    chat_sessions.pop(session_id, None)
    return {"success": True}
