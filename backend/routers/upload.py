"""
Upload router — POST /api/upload
Accepts a garment or model image, saves it locally (dev), returns a URL.
"""

import uuid
from pathlib import Path
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_BYTES = 10 * 1024 * 1024  # 10 MB


class UploadResponse(BaseModel):
    id: str
    url: str
    original_filename: str
    content_type: str
    size_bytes: int


@router.post("/upload", response_model=UploadResponse, summary="Upload an image")
async def upload_image(file: UploadFile = File(...)) -> UploadResponse:
    """Accepts JPEG / PNG / WebP up to 10 MB. Returns a local preview URL."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file.content_type}'. Use JPEG, PNG, or WebP.",
        )

    contents = await file.read()
    if len(contents) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10 MB.")

    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else "jpg"
    file_id = str(uuid.uuid4())
    saved_name = f"{file_id}.{ext}"
    (UPLOAD_DIR / saved_name).write_bytes(contents)

    return UploadResponse(
        id=file_id,
        url=f"/api/uploads/{saved_name}",
        original_filename=file.filename or saved_name,
        content_type=file.content_type,
        size_bytes=len(contents),
    )


@router.get("/uploads/{filename}", summary="Serve an uploaded image")
async def serve_upload(filename: str) -> FileResponse:
    """Returns a previously uploaded image by filename."""
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found.")
    return FileResponse(file_path)
