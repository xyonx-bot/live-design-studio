from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Live Design Studio"
    DEBUG: bool = True
    
    # Workspace
    WORKSPACE_PATH: str = "/workspace"
    
    # Auth
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week
    
    # CORS
    ALLOWED_ORIGINS: list[str] = ["*"]
    
    # Git
    GIT_USER_NAME: str = "Live Design Studio Agent"
    GIT_USER_EMAIL: str = "agent@live-design-studio.local"
    
    # WebSocket
    WS_HEARTBEAT_INTERVAL: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()