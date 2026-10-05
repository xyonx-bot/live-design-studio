from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from app.core.config import get_settings
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from app.models.schemas import Token, UserCreate, FileItem, FileContent, FileWrite, FileEdit, CommitRequest, CommitResponse, ComponentPreview, ScreenshotRequest, ErrorResponse
from app.services.workspace import workspace_service
from app.services.websocket import manager
import os

settings = get_settings()
router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# In-memory user store (replace with DB in production)
users_db = {}

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    username = payload.get("sub")
    if username not in users_db:
        raise HTTPException(status_code=401, detail="User not found")
    return users_db[username]

@router.post("/auth/register", response_model=Token)
async def register(user: UserCreate):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = get_password_hash(user.password)
    users_db[user.username] = {"username": user.username, "hashed_password": hashed_password}
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return {"username": current_user["username"]}

# File operations
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

# Components
@router.get("/components", response_model=List[str])
async def list_components(current_user: dict = Depends(get_current_user)):
    return workspace_service.list_components()

# Git
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

# WebSocket
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    # For simplicity, accept without token validation in WS
    # In production, validate token from query param
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Echo back or handle messages
            await manager.send_personal_message({"type": "ack", "payload": data}, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)