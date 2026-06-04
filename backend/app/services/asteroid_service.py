"""NASA NeoWs asteroid feed + risk scoring with fallback."""
from datetime import date, timedelta

from app.core.config import settings
from app.ml.asteroid_risk_score import score_asteroid
from app.utils import api_client, fallback_loader
from app.utils.validators import to_float

FEED_URL = "https://api.nasa.gov/neo/rest/v1/feed"


def _enrich(a: dict) -> dict:
    scored = score_asteroid(
        a.get("estimated_diameter_km"),
        a.get("relative_velocity_kph"),
        a.get("miss_distance_km"),
        a.get("is_potentially_hazardous"),
    )
    return {**a, **scored}


async def get_upcoming() -> dict:
    start = date.today()
    end = start + timedelta(days=6)
    params = {
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "api_key": settings.nasa_key,
    }
    try:
        data = await api_client.get_json(FEED_URL, params=params)
        out: list[dict] = []
        for day in data.get("near_earth_objects", {}).values():
            for neo in day:
                ca = (neo.get("close_approach_data") or [{}])[0]
                diam = neo.get("estimated_diameter", {}).get("kilometers", {})
                out.append(_enrich({
                    "id": str(neo.get("id", "")),
                    "name": neo.get("name", "Unknown"),
                    "close_approach_date": ca.get("close_approach_date", start.isoformat()),
                    "estimated_diameter_km": round((
                        (diam.get("estimated_diameter_min", 0) +
                         diam.get("estimated_diameter_max", 0)) / 2), 4),
                    "relative_velocity_kph": to_float(
                        ca.get("relative_velocity", {}).get("kilometers_per_hour"), 0.0),
                    "miss_distance_km": to_float(
                        ca.get("miss_distance", {}).get("kilometers"), 0.0),
                    "is_potentially_hazardous": neo.get(
                        "is_potentially_hazardous_asteroid", False),
                    "absolute_magnitude_h": neo.get("absolute_magnitude_h"),
                }))
        if not out:
            raise ValueError("empty feed")
        out.sort(key=lambda x: x["risk_score"], reverse=True)
        return {"element_count": len(out), "asteroids": out, "fallback": False}
    except Exception:  # noqa: BLE001
        return _fallback()


def _fallback() -> dict:
    raw = fallback_loader.load_json("asteroids_sample.json")["asteroids"]
    out = [_enrich(a) for a in raw]
    out.sort(key=lambda x: x["risk_score"], reverse=True)
    return {"element_count": len(out), "asteroids": out, "fallback": True}
