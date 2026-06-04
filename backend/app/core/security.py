"""Security helpers. Secrets stay backend-only and are never returned or logged."""
from app.core.config import settings


def nasa_key_present() -> bool:
    return bool(settings.NASA_API_KEY)


def ai_key_present() -> bool:
    return settings.has_ai_key
