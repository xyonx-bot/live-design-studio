import os
import git
from pathlib import Path
from typing import List, Optional
from datetime import datetime
from app.core.config import get_settings
from app.models.schemas import FileItem, CommitResponse

settings = get_settings()


class WorkspaceService:
    def __init__(self):
        self.workspace_path = Path(settings.WORKSPACE_PATH)
        self.workspace_path.mkdir(parents=True, exist_ok=True)
        self._init_git()
    
    def _init_git(self):
        """Initialize git repo if not exists"""
        git_dir = self.workspace_path / ".git"
        if not git_dir.exists():
            self.repo = git.Repo.init(self.workspace_path)
            with self.repo.config_writer() as git_config:
                git_config.set_value("user", "name", settings.GIT_USER_NAME)
                git_config.set_value("user", "email", settings.GIT_USER_EMAIL)
            # Create initial commit if empty
            if not list(self.workspace_path.glob("*")):
                (self.workspace_path / ".gitkeep").touch()
                self.repo.index.add([".gitkeep"])
                self.repo.index.commit("Initial commit")
        else:
            self.repo = git.Repo(self.workspace_path)
    
    def _resolve_path(self, path: str) -> Path:
        """Resolve and validate path is within workspace"""
        target = (self.workspace_path / path).resolve()
        if not str(target).startswith(str(self.workspace_path.resolve())):
            raise ValueError("Path escapes workspace")
        return target
    
    def list_files(self, path: str = "") -> List[FileItem]:
        """List files in workspace"""
        target = self._resolve_path(path)
        items = []
        for item in target.iterdir():
            stat = item.stat()
            items.append(FileItem(
                name=item.name,
                path=str(item.relative_to(self.workspace_path)),
                is_dir=item.is_dir(),
                size=stat.st_size if item.is_file() else None,
                modified=datetime.fromtimestamp(stat.st_mtime)
            ))
        return items
    
    def read_file(self, path: str) -> str:
        """Read file content"""
        target = self._resolve_path(path)
        if not target.exists() or not target.is_file():
            raise FileNotFoundError(f"File not found: {path}")
        return target.read_text(encoding="utf-8")
    
    def write_file(self, path: str, content: str) -> str:
        """Write file content"""
        target = self._resolve_path(path)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
        return str(target.relative_to(self.workspace_path))
    
    def edit_file(self, path: str, old_string: str, new_string: str, replace_all: bool = False) -> str:
        """Edit file with patch"""
        target = self._resolve_path(path)
        if not target.exists():
            raise FileNotFoundError(f"File not found: {path}")
        content = target.read_text(encoding="utf-8")
        if replace_all:
            new_content = content.replace(old_string, new_string)
        else:
            if old_string not in content:
                raise ValueError("Old string not found in file")
            new_content = content.replace(old_string, new_string, 1)
        target.write_text(new_content, encoding="utf-8")
        return str(target.relative_to(self.workspace_path))
    
    def delete_file(self, path: str) -> bool:
        """Delete file"""
        target = self._resolve_path(path)
        if target.exists():
            target.unlink()
            return True
        return False
    
    def list_components(self) -> List[str]:
        """List available component previews"""
        components = []
        src_path = self.workspace_path / "src"
        if not src_path.exists():
            return components
        
        for category in ["components", "layout", "sections"]:
            cat_path = src_path / category
            if cat_path.exists():
                for preview_file in cat_path.glob("*.preview.tsx"):
                    components.append(f"{category}/{preview_file.stem.replace('.preview', '')}")
        return components
    
    def commit(self, message: str) -> CommitResponse:
        """Commit changes"""
        self.repo.git.add(A=True)
        if self.repo.index.diff("HEAD") or self.repo.untracked_files:
            commit = self.repo.index.commit(message)
            return CommitResponse(
                sha=commit.hexsha[:8],
                message=commit.message.strip(),
                author=str(commit.author),
                date=datetime.fromtimestamp(commit.committed_date)
            )
        return CommitResponse(
            sha="",
            message="No changes to commit",
            author="",
            date=datetime.now()
        )
    
    def get_history(self, limit: int = 50) -> List[CommitResponse]:
        """Get commit history"""
        commits = []
        for commit in self.repo.iter_commits(max_count=limit):
            commits.append(CommitResponse(
                sha=commit.hexsha[:8],
                message=commit.message.strip(),
                author=str(commit.author),
                date=datetime.fromtimestamp(commit.committed_date)
            ))
        return commits
    
    def checkout(self, sha: str) -> bool:
        """Checkout a specific commit"""
        try:
            self.repo.git.checkout(sha)
            return True
        except git.GitCommandError:
            return False


workspace_service = WorkspaceService()