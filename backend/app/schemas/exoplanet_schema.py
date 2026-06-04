from pydantic import BaseModel


class Exoplanet(BaseModel):
    pl_name: str | None = None
    hostname: str | None = None
    discoverymethod: str | None = None
    disc_year: int | None = None
    pl_rade: float | None = None
    pl_bmasse: float | None = None
    pl_orbper: float | None = None
    st_teff: float | None = None
    st_rad: float | None = None
    pl_eqt: float | None = None
    planet_name: str
    host_star: str | None = None
    discovery_method: str | None = None
    discovery_year: int | None = None
    planet_radius_earth: float | None = None
    planet_mass_earth: float | None = None
    orbital_period_days: float | None = None
    stellar_temperature: float | None = None
    stellar_radius: float | None = None
    equilibrium_temperature: float | None = None
    habitability_score: int
    habitability_category: str
    explanation: str
    missing_data_warning: str | None = None


class ExoplanetListResponse(BaseModel):
    count: int
    exoplanets: list[Exoplanet]
    fallback: bool = False


class ExoplanetStats(BaseModel):
    total: int
    discovery_methods: dict[str, int]
    discoveries_by_year: dict[str, int]
    avg_radius_earth: float | None = None
    avg_orbital_period_days: float | None = None
    fallback: bool = False


class HabitabilityResponse(BaseModel):
    habitability_score: int
    category: str
    explanation: str
    missing_data_warning: str | None = None
