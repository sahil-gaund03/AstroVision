from pydantic import BaseModel


class Asteroid(BaseModel):
    id: str
    name: str
    close_approach_date: str
    estimated_diameter_km: float
    relative_velocity_kph: float
    miss_distance_km: float
    is_potentially_hazardous: bool
    absolute_magnitude_h: float | None = None
    risk_score: int
    risk_level: str
    explanation: str


class AsteroidListResponse(BaseModel):
    element_count: int
    asteroids: list[Asteroid]
    fallback: bool = False


class RiskScoreResponse(BaseModel):
    risk_score: int
    risk_level: str
    explanation: str
