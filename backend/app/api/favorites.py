from fastapi import APIRouter, HTTPException

from app.schemas.common_schema import FavoriteCreate, FavoriteItem
from app.services import favorites_service

router = APIRouter(prefix="/api/favorites", tags=["favorites"])


@router.get("", response_model=list[FavoriteItem])
async def list_favorites():
    return favorites_service.list_favorites()


@router.post("", response_model=FavoriteItem)
async def add_favorite(item: FavoriteCreate):
    return favorites_service.add_favorite(item.model_dump())


@router.delete("/{fid}")
async def delete_favorite(fid: str):
    if not favorites_service.delete_favorite(fid):
        raise HTTPException(404, "Favorite not found")
    return {"deleted": fid}
