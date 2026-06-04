import httpx

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("api_client")


class UpstreamError(Exception):
    """Raised when an external API call fails or times out."""


async def get_json(url: str, params: dict | None = None) -> dict:
    """GET JSON from an external API. Raises UpstreamError on any failure.

    Never logs query params (they may contain the NASA api_key).
    """
    try:
        async with httpx.AsyncClient(timeout=settings.HTTP_TIMEOUT) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            return resp.json()
    except httpx.TimeoutException as e:
        logger.warning("Upstream timeout for %s", _safe(url))
        raise UpstreamError("timeout") from e
    except httpx.HTTPStatusError as e:
        logger.warning("Upstream %s for %s", e.response.status_code, _safe(url))
        raise UpstreamError(f"status {e.response.status_code}") from e
    except Exception as e:  # noqa: BLE001
        logger.warning("Upstream error for %s: %s", _safe(url), type(e).__name__)
        raise UpstreamError("request failed") from e


async def get_text(url: str, params: dict | None = None) -> str:
    try:
        async with httpx.AsyncClient(timeout=settings.HTTP_TIMEOUT) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            return resp.text
    except Exception as e:  # noqa: BLE001
        logger.warning("Upstream text error for %s: %s", _safe(url), type(e).__name__)
        raise UpstreamError("request failed") from e


def _safe(url: str) -> str:
    return url.split("?", 1)[0]
