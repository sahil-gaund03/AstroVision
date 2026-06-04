from fastapi import APIRouter

from app.services import solar_system_service

router = APIRouter(prefix="/api/solar-system", tags=["solar-system"])


@router.get("/planets")
async def planets():
    return solar_system_service.get_planets()
