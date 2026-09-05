from typing import Optional
from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    """Payload received from the Django backend for any AI tool."""

    tool: str = Field(..., description="Tool slug, e.g. 'summarizer', 'blog-writer'")
    prompt: str = Field(..., min_length=1, description="Main user input for the tool")
    options: Optional[dict] = Field(default_factory=dict, description="Extra tool settings")


class GenerateResponse(BaseModel):
    result: str
    tool: str
    provider: str
