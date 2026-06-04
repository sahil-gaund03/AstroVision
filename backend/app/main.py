from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api import asteroids, assistant, exoplanets, favorites, nasa, solar_system
from app.core.config import settings
from app.core.cors import setup_cors
from app.core.logging import get_logger
from app.core.rate_limit import setup_rate_limit
from app.core.security import ai_key_present, nasa_key_present
from app.schemas.common_schema import HealthResponse

logger = get_logger("main")

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

setup_cors(app)
setup_rate_limit(app)

app.include_router(nasa.router)
app.include_router(asteroids.router)
app.include_router(exoplanets.router)
app.include_router(assistant.router)
app.include_router(solar_system.router)
app.include_router(favorites.router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.info("Validation error on %s (%s errors)", request.url.path, len(exc.errors()))
    return JSONResponse(
        status_code=422,
        content={"detail": "Invalid request parameters."},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s: %s", request.url.path, type(exc).__name__)
    return JSONResponse(
        status_code=500,
        content={"detail": "Unexpected server error."},
    )


@app.get("/health", response_model=HealthResponse, tags=["health"])
async def health():
    return HealthResponse(
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        nasa_key_configured=nasa_key_present(),
        ai_key_configured=ai_key_present(),
    )


@app.get("/", tags=["health"])
async def root():
    return {"name": settings.APP_NAME, "docs": "/docs", "health": "/health"}
