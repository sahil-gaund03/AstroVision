from fastapi import APIRouter

from app.schemas.assistant_schema import ChatRequest, ChatResponse
from app.services import ai_service

router = APIRouter(prefix="/api/assistant", tags=["assistant"])


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    result = await ai_service.chat(req.message, req.context_type, req.context_data)
    return result
