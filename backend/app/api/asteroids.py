from fastapi import APIRouter, Query

from app.ml.asteroid_risk_score import score_asteroid
from app.services import asteroid_service

router = APIRouter(prefix="/api/asteroids", tags=["asteroids"])


@router.get("/upcoming")
async def upcoming():
    return await asteroid_service.get_upcoming()


@router.get("/risk-score")
async def risk_score(
    estimated_diameter_km: float = Query(..., ge=0, le=1000),
    relative_velocity_kph: float = Query(..., ge=0, le=500000),
    miss_distance_km: float = Query(..., ge=0, le=10000000000),
    is_potentially_hazardous: bool = Query(False),
):
    return score_asteroid(
        estimated_diameter_km,
        relative_velocity_kph,
        miss_distance_km,
        is_potentially_hazardous,
    )
