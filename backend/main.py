"""
FabricToModel — FastAPI Backend
Entry point: starts the server and registers all routers.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import health, upload, generate

# ── Load environment variables ─────────────────────────────
load_dotenv()

# ── Initialize FastAPI app ────────────────────────────────
app = FastAPI(
    title="FabricToModel API",
    description=(
        "Virtual try-on backend for South Asian fashion. "
        "Handles image upload, garment segmentation, try-on generation, "
        "and AI styling suggestions."
    ),
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ── CORS ────────────────────────────────────────────────────
# Allow frontend calls (Next.js or localhost)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Root endpoint ──────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "FabricToModel Backend is running!"}

# ── Debug: List all routes ─────────────────────────────────
@app.get("/routes")
def list_routes():
    return [{"path": route.path, "name": route.name} for route in app.routes]

# ── Routers ────────────────────────────────────────────────
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(generate.router, prefix="/api", tags=["generate"])

# ── Optional: Future routers (commented) ───────────────────
# from routers import segmentation
# app.include_router(segmentation.router, prefix="/api", tags=["segmentation"])

# from routers import tryon
# app.include_router(tryon.router, prefix="/api", tags=["try-on"])

# from routers import styling
# app.include_router(styling.router, prefix="/api", tags=["styling"])

# from routers import results
# app.include_router(results.router, prefix="/api", tags=["results"])

# ── Run server ─────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload in development
    )