from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional
from pydantic import BaseModel
from app.core.config import get_settings
from app.core.security import verify_password, create_access_token, decode_access_token
from app.models.schemas import Token, FileItem, FileContent, FileWrite, FileEdit, CommitRequest, CommitResponse
from app.services.workspace import workspace_service
from app.services import canvases as canvases_service
from app.services import r2 as r2_service
from app.services.websocket import manager
from app.agent_prompt import build_prompt
import os
import httpx

# Chat multipart support
from fastapi import UploadFile, File, Form

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
    if payload.get("sub") != ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="User not found")
    return {"username": ADMIN_USERNAME}


@router.post("/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if not ADMIN_PASSWORD:
        raise HTTPException(status_code=503, detail="Auth not configured on server")
    if form_data.username != ADMIN_USERNAME or form_data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_access_token(data={"sub": ADMIN_USERNAME}), "token_type": "bearer"}


@router.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return current_user


# ── Canvases ──────────────────────────────────────────────────────────────────
class CanvasCreate(BaseModel):
    name: str


class CanvasModel(BaseModel):
    model: str


@router.get("/canvases")
async def list_canvases(user: dict = Depends(get_current_user)):
    return canvases_service.list_canvases()


@router.post("/canvases")
async def create_canvas(body: CanvasCreate, user: dict = Depends(get_current_user)):
    return canvases_service.create_canvas(body.name)


@router.get("/canvases/{canvas_id}/meta")
async def canvas_meta(canvas_id: str, user: dict = Depends(get_current_user)):
    try:
        return canvases_service.get_canvas(canvas_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Canvas not found")


@router.post("/canvases/{canvas_id}/archive")
async def archive_canvas(canvas_id: str, user: dict = Depends(get_current_user)):
    try:
        return canvases_service.set_archived(canvas_id, True)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Canvas not found")


@router.get("/canvases/{canvas_id}/pieces")
async def canvas_pieces(canvas_id: str, user: dict = Depends(get_current_user)):
    try:
        return canvases_service.list_pieces(canvas_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Canvas not found")


@router.get("/canvases/{canvas_id}/history")
async def canvas_history(canvas_id: str, user: dict = Depends(get_current_user)):
    try:
        hist = canvases_service.load_history(canvas_id)
        meta = canvases_service.get_canvas(canvas_id)
        running = [j for j in _jobs.values() if j.get("canvas_id") == canvas_id and j.get("status") == "running"]
        return {"history": hist, "session_id": meta.get("session_id"), "model": meta.get("model"),
                "running_job": running[-1] if running else None}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Canvas not found")


@router.get("/models")
async def models(user: dict = Depends(get_current_user)):
    """Models exposed by the Hermes api_server (for the picker validation)."""
    headers = {"Authorization": f"Bearer {HERMES_API_KEY}"} if HERMES_API_KEY else {}
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(f"{HERMES_AGENT_URL}/v1/models", headers=headers)
            r.raise_for_status()
            data = r.json()
        return {"models": [m.get("id") for m in data.get("data", [])], "current": HERMES_AGENT_MODEL}
    except Exception as e:
        return {"models": [], "error": str(e), "current": HERMES_AGENT_MODEL}


@router.post("/canvases/{canvas_id}/model")
async def set_canvas_model(canvas_id: str, body: CanvasModel, user: dict = Depends(get_current_user)):
    headers = {"Authorization": f"Bearer {HERMES_API_KEY}"} if HERMES_API_KEY else {}
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(f"{HERMES_AGENT_URL}/v1/models", headers=headers)
            if r.ok:
                valid = {m.get("id") for m in r.json().get("data", [])}
                if valid and body.model not in valid:
                    raise HTTPException(status_code=400, detail=f"Model '{body.model}' not in api_server /v1/models")
    except httpx.HTTPError:
        pass  # accept anyway if api_server unreachable
    try:
        return canvases_service.set_model(canvas_id, body.model)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Canvas not found")


# ── File operations (canvas-scoped: path relative to canvases/<id>/) ─────────
def _canvas_rel(canvas_id: str, path: str) -> str:
    return f"canvases/{canvas_id}/{path.lstrip('/')}"


@router.get("/files", response_model=List[FileItem])
async def list_files(path: str = "", canvas_id: str = "default", current_user: dict = Depends(get_current_user)):
    return workspace_service.list_files(_canvas_rel(canvas_id, path))


@router.get("/files/content", response_model=FileContent)
async def read_file(path: str, canvas_id: str = "default", current_user: dict = Depends(get_current_user)):
    try:
        return {"path": path, "content": workspace_service.read_file(_canvas_rel(canvas_id, path))}
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/files", response_model=FileContent)
async def write_file(file: FileWrite, canvas_id: str = "default", current_user: dict = Depends(get_current_user)):
    try:
        path = workspace_service.write_file(_canvas_rel(canvas_id, file.path), file.content)
        await manager.broadcast_event("file_changed", {"path": path, "action": "write", "canvas_id": canvas_id})
        return {"path": path, "content": file.content}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/files", response_model=FileContent)
async def edit_file(file: FileEdit, canvas_id: str = "default", current_user: dict = Depends(get_current_user)):
    try:
        path = workspace_service.edit_file(_canvas_rel(canvas_id, file.path), file.old_string, file.new_string, file.replace_all)
        content = workspace_service.read_file(path)
        await manager.broadcast_event("file_changed", {"path": path, "action": "edit", "canvas_id": canvas_id})
        return {"path": path, "content": content}
    except (FileNotFoundError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/files")
async def delete_file(path: str, canvas_id: str = "default", current_user: dict = Depends(get_current_user)):
    success = workspace_service.delete_file(_canvas_rel(canvas_id, path))
    if success:
        await manager.broadcast_event("file_changed", {"path": path, "action": "delete", "canvas_id": canvas_id})
    return {"success": success}


# ── Components ────────────────────────────────────────────────────────────────
@router.get("/components", response_model=List[str])
async def list_components(canvas_id: str = "default", current_user: dict = Depends(get_current_user)):
    try:
        return [f"{p['group']}:{p['name']}" for p in canvases_service.list_pieces(canvas_id)]
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Canvas not found")


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
    ok = workspace_service.checkout(sha)
    if ok:
        await manager.broadcast_event("git_checkout", {"sha": sha})
    return {"success": ok}


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


# ── Hermes chat proxy — OpenAI-compatible api_server, history per canvas ─────
HERMES_AGENT_URL = os.getenv("HERMES_AGENT_URL", "http://172.19.0.1:8644").rstrip("/")
HERMES_API_KEY = os.getenv("HERMES_API_KEY", "")
HERMES_MODEL = os.getenv("HERMES_MODEL", "hermes-agent")
HERMES_AGENT_MODEL = HERMES_MODEL  # default; per-canvas override via set_model


@router.post("/uploads")
async def upload_image(file: UploadFile = File(...), canvas_id: str = Form("default"), user: dict = Depends(get_current_user)):
    """Upload an image to R2; returns the public URL to include in chat messages."""
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="empty file")
    if len(data) > 8 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="file too large (max 8MB)")
    url = r2_service.upload(data, file.content_type or "application/octet-stream", file.filename or "")
    return {"url": url, "name": file.filename, "content_type": file.content_type, "size": len(data)}


class ChatIn(BaseModel):
    message: str
    session_id: Optional[str] = None
    canvas_id: str = "default"
    image_url: Optional[str] = None


class ChatOut(BaseModel):
    response: str
    session_id: Optional[str] = None
    canvas_id: Optional[str] = None
    tools_used: List[str] = []


@router.post("/chat", response_model=ChatOut)
async def chat_with_agent(body: ChatIn, current_user: dict = Depends(get_current_user)):
    """Start a chat turn in the background; poll /chat/jobs/<job_id> for the reply."""
    import asyncio, uuid
    canvas_id = body.canvas_id or "default"
    try:
        canvases_service.get_canvas(canvas_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Canvas not found")

    job_id = uuid.uuid4().hex[:12]
    _jobs[job_id] = {"job_id": job_id, "status": "running", "canvas_id": canvas_id, "response": None,
                     "started_at": __import__("datetime").datetime.utcnow().isoformat()}

    async def run():
        history = canvases_service.load_history(canvas_id)
        model = canvases_service.get_model(canvas_id) or HERMES_AGENT_MODEL
        headers = {"Content-Type": "application/json"}
        if HERMES_API_KEY:
            headers["Authorization"] = f"Bearer {HERMES_API_KEY}"
        try:
            # Persist the user's turn immediately so a refresh / reload doesn't lose it.
            canvases_service.append_history(canvas_id, "user", body.message, image_url=body.image_url)
            async with httpx.AsyncClient(timeout=600.0) as client:
                resp = await client.post(f"{HERMES_AGENT_URL}/v1/chat/completions",
                                         json={"model": model,
                                               "messages": messages_payload(canvas_id, body.message, history, image_url=body.image_url),
                                               "stream": False},
                                         headers=headers)
                resp.raise_for_status()
                data = resp.json()
            reply = (data.get("choices") or [{}])[0].get("message", {}).get("content", "")
            canvases_service.append_history(canvas_id, "assistant", reply)
            _jobs[job_id] = {**_jobs[job_id], "status": "done", "response": reply or "(empty response)"}
        except Exception as e:
            _jobs[job_id] = {**_jobs[job_id], "status": "error", "response": f"{type(e).__name__}: {e}"}

    asyncio.create_task(run())
    return ChatOut(response="", session_id=job_id, canvas_id=canvas_id, tools_used=[])


def messages_payload(canvas_id: str, new_message: str, history: List[dict], image_url: Optional[str] = None) -> List[dict]:
    sys_msg = build_prompt(canvas_id)
    if image_url:
        sys_msg += f"\n\nThe user attached this image to the message; use it as visual reference when designing: {image_url}"
    user_content = [{"type": "text", "text": new_message}]
    if image_url:
        user_content.append({"type": "image_url", "image_url": {"url": image_url}})
    return [{"role": "system", "content": sys_msg}] + [
        {"role": h["role"], "content": h["content"]} for h in history[-39:]
    ] + [{"role": "user", "content": user_content}]


# in-memory job store (jobs are short-lived anyway)
_jobs: dict = {}


@router.get("/chat/jobs/{job_id}")
async def chat_job(job_id: str, current_user: dict = Depends(get_current_user)):
    job = _jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


class ChatReset(BaseModel):
    session_id: Optional[str] = None
    canvas_id: Optional[str] = None


@router.post("/chat/reset")
async def reset_chat(body: ChatReset, current_user: dict = Depends(get_current_user)):
    cid = body.canvas_id or "default"
    canvases_service.clear_history(cid)
    canvases_service.set_session(cid, None)
    return {"success": True}
