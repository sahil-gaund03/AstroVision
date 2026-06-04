from fastapi import APIRouter, Query

from app.ml.habitability_score import score_habitability
from app.services import exoplanet_service
from app.utils.validators import clean_query

router = APIRouter(prefix="/api/exoplanets", tags=["exoplanets"])


@router.get("/confirmed")
async def confirmed(limit: int = Query(100, ge=1, le=300)):
    return await exoplanet_service.get_confirmed(limit=limit)


@router.get("/stats")
async def stats():
    return await exoplanet_service.get_stats()


@router.get("/search")
async def search(q: str = Query("kepler"), limit: int = Query(100, ge=1, le=300)):
    return await exoplanet_service.get_confirmed(search=clean_query(q), limit=limit)


@router.get("/habitability-score")
async def habitability(
    planet_radius_earth: float | None = Query(None, ge=0, le=100),
    planet_mass_earth: float | None = Query(None, ge=0, le=10000),
    orbital_period_days: float | None = Query(None, ge=0, le=1000000),
    stellar_temperature: float | None = Query(None, ge=0, le=100000),
    equilibrium_temperature: float | None = Query(None, ge=0, le=10000),
):
    return score_habitability(
        planet_radius_earth,
        planet_mass_earth,
        orbital_period_days,
        stellar_temperature,
        equilibrium_temperature,
    )
