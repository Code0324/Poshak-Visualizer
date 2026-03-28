"""
Health check endpoint.
GET /api/health — returns server status, version, and current UTC timestamp.
Used by the frontend to confirm the backend is reachable before starting a job.
"""

from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: str   # ISO 8601 UTC
    version: str
    environment: str


@router.get("/health", response_model=HealthResponse, summary="Health check")
async def health_check() -> HealthResponse:
    """Returns OK when the server is up and all env vars are loadable."""
    import os

    # Detect environment from env var (default: development)
    env = os.getenv("ENVIRONMENT", "development")

    return HealthResponse(
        status="ok",
        message="FabricToModel API is running",
        timestamp=datetime.now(timezone.utc).isoformat(),
        version="1.0.0",
        environment=env,
    )
