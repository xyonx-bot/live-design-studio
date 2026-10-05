from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


class User(BaseModel):
    username: str
    hashed_password: str


class UserCreate(BaseModel):
    username: str
    password: str


class FileItem(BaseModel):
    name: str
    path: str
    is_dir: bool
    size: Optional[int] = None
    modified: Optional[datetime] = None


class FileContent(BaseModel):
    path: str
    content: str


class FileWrite(BaseModel):
    path: str
    content: str


class FileEdit(BaseModel):
    path: str
    old_string: str
    new_string: str
    replace_all: bool = False


class CommitRequest(BaseModel):
    message: str


class CommitResponse(BaseModel):
    sha: str
    message: str
    author: str
    date: datetime


class ComponentPreview(BaseModel):
    name: str
    type: str  # component, layout, section
    preview_path: str


class ScreenshotRequest(BaseModel):
    viewport: str = "desktop"  # desktop, mobile, tablet
    component: Optional[str] = None


class ErrorResponse(BaseModel):
    errors: List[str]


class WSMessage(BaseModel):
    type: str
    payload: dict