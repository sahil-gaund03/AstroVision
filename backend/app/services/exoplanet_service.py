"""NASA Exoplanet Archive TAP integration with CSV fallback + habitability scoring."""
from collections import Counter

from app.ml.habitability_score import score_habitability
from app.utils import api_client, fallback_loader
from app.utils.validators import to_float

TAP_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
FIELDS = ("pl_name,hostname,discoverymethod,disc_year,pl_rade,pl_bmasse,"
          "pl_orbper,st_teff,st_rad,pl_eqt")
QUERY = (f"select top 300 {FIELDS} from ps where default_flag=1 "
         "and pl_rade is not null order by disc_year desc")


def _to_int(v):
    f = to_float(v)
    return int(f) if f is not None else None


def _normalize(row: dict) -> dict:
    radius = to_float(row.get("pl_rade"))
    mass = to_float(row.get("pl_bmasse"))
    period = to_float(row.get("pl_orbper"))
    steff = to_float(row.get("st_teff"))
    srad = to_float(row.get("st_rad"))
    eqt = to_float(row.get("pl_eqt"))
    hab = score_habitability(radius, mass, period, steff, eqt)
    discovery_year = _to_int(row.get("disc_year"))
    planet_name = row.get("pl_name", "Unknown")
    return {
        "pl_name": planet_name,
        "hostname": row.get("hostname"),
        "discoverymethod": row.get("discoverymethod"),
        "disc_year": discovery_year,
        "pl_rade": radius,
        "pl_bmasse": mass,
        "pl_orbper": period,
        "st_teff": steff,
        "st_rad": srad,
        "pl_eqt": eqt,
        "planet_name": planet_name,
        "host_star": row.get("hostname"),
        "discovery_method": row.get("discoverymethod"),
        "discovery_year": discovery_year,
        "planet_radius_earth": radius,
        "planet_mass_earth": mass,
        "orbital_period_days": period,
        "stellar_temperature": steff,
        "stellar_radius": srad,
        "equilibrium_temperature": eqt,
        "habitability_score": hab["habitability_score"],
        "habitability_category": hab["category"],
        "explanation": hab["explanation"],
        "missing_data_warning": hab["missing_data_warning"],
    }


async def _load_rows() -> tuple[list[dict], bool]:
    try:
        text = await api_client.get_text(
            TAP_URL, params={"query": QUERY, "format": "csv"})
        rows = fallback_loader.parse_csv_text(text)
        if not rows:
            raise ValueError("empty TAP")
        return rows, False
    except Exception:  # noqa: BLE001
        return fallback_loader.load_csv_rows("exoplanets_sample.csv"), True


async def get_confirmed(search: str | None = None, limit: int = 100) -> dict:
    rows, fb = await _load_rows()
    planets = [_normalize(r) for r in rows]
    if search:
        s = search.lower()
        planets = [p for p in planets
                   if s in (p["planet_name"] or "").lower()
                   or s in (p["host_star"] or "").lower()]
    planets = planets[:limit]
    return {"count": len(planets), "exoplanets": planets, "fallback": fb}


async def get_stats() -> dict:
    rows, fb = await _load_rows()
    planets = [_normalize(r) for r in rows]
    methods = Counter(p["discovery_method"] or "Unknown" for p in planets)
    years = Counter(str(p["discovery_year"]) for p in planets if p["discovery_year"])
    radii = [p["planet_radius_earth"] for p in planets if p["planet_radius_earth"]]
    periods = [p["orbital_period_days"] for p in planets if p["orbital_period_days"]]
    return {
        "total": len(planets),
        "discovery_methods": dict(methods),
        "discoveries_by_year": dict(sorted(years.items())),
        "avg_radius_earth": round(sum(radii) / len(radii), 2) if radii else None,
        "avg_orbital_period_days": round(sum(periods) / len(periods), 2) if periods else None,
        "fallback": fb,
    }
