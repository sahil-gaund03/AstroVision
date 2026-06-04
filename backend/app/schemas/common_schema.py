from typing import Any, Literal

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    app: str
    version: str
    nasa_key_configured: bool
    ai_key_configured: bool


class FavoriteItem(BaseModel):
    id: str
    type: Literal["apod", "image", "asteroid", "exoplanet", "planet"]
    title: str = Field(..., min_length=1, max_length=160)
    payload: dict[str, Any] = Field(default_factory=dict)


class FavoriteCreate(BaseModel):
    type: Literal["apod", "image", "asteroid", "exoplanet", "planet"]
    title: str = Field(..., min_length=1, max_length=160)
    payload: dict[str, Any] = Field(default_factory=dict)
