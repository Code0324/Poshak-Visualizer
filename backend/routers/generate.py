"""
Generate router — supports both GET and POST
POST /api/generate — accepts fabric image + style params
"""
import io
import os
import base64
import requests
from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from fastapi.responses import Response
from services.fashion_agent import get_fashion_agent

router = APIRouter()

HF_URL = "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0"

def _get_fabric_description(fabric_bytes: bytes) -> str:
    """Convert fabric image to base64 description for prompt."""
    b64 = base64.b64encode(fabric_bytes).decode()
    return f"fabric texture base64 length {len(b64)}"

@router.post("/generate", summary="Generate fashion image with fabric")
async def generate_image_post(
    fabric: UploadFile = File(...),
    style: str = Form("shalwar-kameez"),
    dupatta: str = Form("draped"),
    embroidery: str = Form("light"),
    fit: str = Form("regular"),
    seed: int = Form(42),
) -> Response:
    hf_token = os.getenv("HUGGINGFACE_TOKEN")
    if not hf_token:
        raise HTTPException(status_code=500, detail="HUGGINGFACE_TOKEN not configured")

    # Read fabric image
    fabric_bytes = await fabric.read()
    
    # Build enhanced prompt with fabric color analysis
    agent = get_fashion_agent()
    
    # Detect dominant color from fabric filename/type for better prompt
    fabric_name = fabric.filename.lower() if fabric.filename else ""
    
    # Build prompt
    prompt = agent.build_prompt(style, dupatta, embroidery, fit, fabric_name)
    
    # Add fabric-specific enhancement
    enhanced_prompt = (
        f"{prompt}, wearing dress made from the exact same fabric pattern and texture "
        f"as shown in the reference image, matching colors and design exactly, "
        f"high fidelity fabric reproduction"
    )

    try:
        resp = requests.post(
            HF_URL,
            headers={"Authorization": f"Bearer {hf_token}"},
            json={"inputs": enhanced_prompt},
            timeout=120,
        )

        if resp.status_code == 503:
            raise HTTPException(status_code=503, detail="Model loading, retry in 10 seconds")
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=f"HuggingFace error: {resp.text[:200]}")

        return Response(content=resp.content, media_type=resp.headers.get("content-type", "image/jpeg"))

    except requests.Timeout:
        raise HTTPException(status_code=504, detail="Generation timed out, retry")
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"API error: {e}")


@router.get("/generate", summary="Generate fashion image (GET)")
async def generate_image_get(
    style: str = Query("shalwar-kameez"),
    dupatta: str = Query("draped"),
    embroidery: str = Query("light"),
    fit: str = Query("regular"),
    seed: int = Query(42),
) -> Response:
    hf_token = os.getenv("HUGGINGFACE_TOKEN")
    if not hf_token:
        raise HTTPException(status_code=500, detail="HUGGINGFACE_TOKEN not configured")

    agent = get_fashion_agent()
    prompt = agent.build_prompt(style, dupatta, embroidery, fit)

    try:
        resp = requests.post(
            HF_URL,
            headers={"Authorization": f"Bearer {hf_token}"},
            json={"inputs": prompt},
            timeout=120,
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=f"HuggingFace error: {resp.text[:200]}")
        return Response(content=resp.content, media_type=resp.headers.get("content-type", "image/jpeg"))
    except requests.Timeout:
        raise HTTPException(status_code=504, detail="Timed out")
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"API error: {e}")