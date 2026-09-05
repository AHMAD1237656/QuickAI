import os

from fastapi import APIRouter, HTTPException

from schemas.schemas import GenerateRequest, GenerateResponse
from services.ai_service import generate_text, TOOL_INSTRUCTIONS

router = APIRouter(prefix="/ai", tags=["AI Tools"])


@router.get("/tools")
def list_supported_tools():
    """Returns the tool slugs this service knows how to handle."""
    return {"tools": list(TOOL_INSTRUCTIONS.keys())}


@router.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    """
    Generate AI content for any of QuickAI's 10 tools.

    This single endpoint supports every tool — the specific behaviour is
    selected via the `tool` field and driven by TOOL_INSTRUCTIONS.
    """
    if request.tool not in TOOL_INSTRUCTIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported tool '{request.tool}'.")

    try:
        result = await generate_text(request.tool, request.prompt, request.options or {})
    except Exception as exc:  # noqa: BLE001 - surface a clean error to the caller
        raise HTTPException(status_code=502, detail=f"AI generation failed: {exc}") from exc

    return GenerateResponse(
        result=result,
        tool=request.tool,
        provider=os.getenv("AI_PROVIDER", "demo"),
    )
