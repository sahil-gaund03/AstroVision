from fastapi import APIRouter, HTTPException, Query

from app.services import nasa_service
from app.utils.validators import clean_query, is_valid_date

router = APIRouter(prefix="/api/nasa", tags=["nasa"])

VALID_ROVERS = {"curiosity", "opportunity", "spirit", "perseverance"}
VALID_CAMERAS = {
    "FHAZ",
    "RHAZ",
    "NAVCAM",
    "MAST",
    "CHEMCAM",
    "MAHLI",
    "MARDI",
    "PANCAM",
    "MINITES",
}


@router.get("/apod")
async def apod(date: str | None = Query(None)):
    if date and not is_valid_date(date):
        raise HTTPException(400, "Invalid date. Use YYYY-MM-DD not in the future.")
    return await nasa_service.get_apod(date)


@router.get("/mars-rover")
async def mars_rover(
    rover: str = Query("curiosity"),
    sol: int | None = Query(None, ge=0),
    camera: str | None = Query(None),
):
    rover_name = clean_query(rover, 32).lower()
    if rover_name not in VALID_ROVERS:
        raise HTTPException(422, "Invalid rover name.")
    camera_name = clean_query(camera or "", 16).upper() or None
    if camera_name and camera_name not in VALID_CAMERAS:
        raise HTTPException(422, "Invalid camera name.")
    return await nasa_service.get_mars_photos(rover_name, sol, camera_name)


@router.get("/images/search")
async def images_search(q: str = Query("galaxy", min_length=1, max_length=100)):
    return await nasa_service.search_images(clean_query(q) or "galaxy")
