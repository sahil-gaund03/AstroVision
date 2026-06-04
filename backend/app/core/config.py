import os
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]
REPO_ROOT = Path(__file__).resolve().parents[3]


def _resolve_samples_dir() -> Path:
    """Find data/samples across deploy layouts (repo root, backend copy,
    Docker mount, or an explicit SAMPLES_DIR env override)."""
    candidates = [
        os.environ.get("SAMPLES_DIR"),
        REPO_ROOT / "data" / "samples",
        BACKEND_DIR / "data" / "samples",
        Path("/data/samples"),
    ]
    for c in candidates:
        if c and Path(c).is_dir():
            return Path(c)
    return REPO_ROOT / "data" / "samples"


SAMPLES_DIR = _resolve_samples_dir()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BACKEND_DIR / ".env", extra="ignore")

    NASA_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://localhost:8000"
    DATABASE_URL: str = "sqlite:///./astrovision.db"
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = ""

    HTTP_TIMEOUT: float = 12.0
    APP_NAME: str = "AstroVision ExoLab AI"
    APP_VERSION: str = "1.0.0"

    @property
    def nasa_key(self) -> str:
        # NASA's public DEMO_KEY works without registration (rate-limited).
        return self.NASA_API_KEY or "DEMO_KEY"

    @property
    def has_ai_key(self) -> bool:
        return bool(self.GEMINI_API_KEY or self.OPENAI_API_KEY)

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.strip().lower() in {"prod", "production"}

    @property
    def cors_origins(self) -> list[str]:
        origins = [
            origin.strip().rstrip("/")
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]
        return origins or [self.FRONTEND_URL.rstrip("/")]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
