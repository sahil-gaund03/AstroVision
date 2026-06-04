from typing import Any, Literal

from pydantic import BaseModel, Field

ContextType = Literal[
    "general",
    "apod",
    "mars",
    "exoplanet",
    "asteroid",
    "planet",
    "image",
]


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    context_type: ContextType = "general"
    context_data: dict[str, Any] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    reply: str
    mode: str  # "ai" or "fallback"
    context_used: bool
