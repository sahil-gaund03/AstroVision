"""NASA API integrations. API key stays backend-only; falls back to sample data."""
from app.core.config import settings
from app.core.logging import get_logger
from app.utils import api_client, fallback_loader

logger = get_logger("nasa_service")

APOD_URL = "https://api.nasa.gov/planetary/apod"
MARS_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers/{rover}/photos"
IMAGES_URL = "https://images-api.nasa.gov/search"


async def get_apod(date: str | None = None) -> dict:
    params = {"api_key": settings.nasa_key}
    if date:
        params["date"] = date
    try:
        data = await api_client.get_json(APOD_URL, params=params)
        return {
            "date": data.get("date", date or ""),
            "title": data.get("title", "Astronomy Picture of the Day"),
            "explanation": data.get("explanation", ""),
            "media_type": data.get("media_type", "image"),
            "url": data.get("url", ""),
            "hdurl": data.get("hdurl"),
            "copyright": data.get("copyright"),
            "fallback": False,
        }
    except Exception:  # noqa: BLE001
        sample = fallback_loader.load_json("apod_sample.json")
        sample["fallback"] = True
        return sample


async def get_mars_photos(rover: str = "curiosity", sol: int | None = None,
                          camera: str | None = None) -> dict:
    rover = (rover or "curiosity").lower()
    params: dict = {"api_key": settings.nasa_key, "sol": sol if sol is not None else 1000}
    if camera:
        params["camera"] = camera.lower()
    try:
        data = await api_client.get_json(MARS_URL.format(rover=rover), params=params)
        photos = []
        for p in data.get("photos", [])[:24]:
            photos.append({
                "id": p.get("id"),
                "img_src": p.get("img_src", ""),
                "earth_date": p.get("earth_date", ""),
                "rover": p.get("rover", {}).get("name", rover.title()),
                "camera": p.get("camera", {}).get("name", ""),
            })
        if not photos:
            raise ValueError("no photos")
        return {"rover": rover.title(), "photos": photos, "fallback": False}
    except Exception:  # noqa: BLE001
        return _mars_fallback(rover, camera)


def _mars_fallback(rover: str, camera: str | None) -> dict:
    imgs = fallback_loader.load_json("nasa_images_sample.json")["items"]
    photos = [{
        "id": i + 1,
        "img_src": it["image"],
        "earth_date": "2024-01-15",
        "rover": rover.title(),
        "camera": (camera or "NAVCAM").upper(),
    } for i, it in enumerate(imgs)]
    return {"rover": rover.title(), "photos": photos, "fallback": True}


async def search_images(query: str) -> dict:
    try:
        data = await api_client.get_json(IMAGES_URL, params={"q": query, "media_type": "image"})
        items = []
        for it in data.get("collection", {}).get("items", [])[:24]:
            meta = (it.get("data") or [{}])[0]
            links = it.get("links") or [{}]
            thumb = links[0].get("href", "")
            items.append({
                "nasa_id": meta.get("nasa_id", ""),
                "title": meta.get("title", "Untitled"),
                "description": (meta.get("description") or "")[:400],
                "date_created": meta.get("date_created", ""),
                "media_type": meta.get("media_type", "image"),
                "thumbnail": thumb,
                "image": thumb,
            })
        if not items:
            raise ValueError("no items")
        return {"query": query, "items": items, "fallback": False}
    except Exception:  # noqa: BLE001
        sample = fallback_loader.load_json("nasa_images_sample.json")
        return {"query": query, "items": sample["items"], "fallback": True}
