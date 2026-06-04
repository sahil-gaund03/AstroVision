"""AI Astronomy Assistant.

Keys stay backend-only. The service falls back to a curated beginner-friendly
knowledge base when no key is configured or when the provider call fails.
"""

import json

import httpx

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("ai_service")

SYSTEM_PROMPT = (
    "You are AstroVision's astronomy assistant. Explain space topics in a clear, "
    "beginner-friendly way. Be accurate, never state uncertain facts as certain, and "
    "mention when data is missing or approximate. Keep answers concise (2-4 short "
    "paragraphs)."
)

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.0-flash:generateContent"
)
OPENAI_URL = "https://api.openai.com/v1/chat/completions"


async def chat(
    message: str,
    context_type: str = "general",
    context_data: dict | None = None,
) -> dict:
    context_data = context_data or {}
    prompt = _build_prompt(message, context_type, context_data)

    if settings.GEMINI_API_KEY:
        try:
            return {
                "reply": await _gemini(prompt),
                "mode": "ai",
                "context_used": bool(context_data),
            }
        except Exception:  # noqa: BLE001
            logger.warning("Gemini call failed; using fallback")
    elif settings.OPENAI_API_KEY:
        try:
            return {
                "reply": await _openai(prompt),
                "mode": "ai",
                "context_used": bool(context_data),
            }
        except Exception:  # noqa: BLE001
            logger.warning("OpenAI call failed; using fallback")

    return {
        "reply": _fallback(message, context_type, context_data),
        "mode": "fallback",
        "context_used": bool(context_data),
    }


def _build_prompt(message: str, ctx_type: str, ctx: dict) -> str:
    parts = [SYSTEM_PROMPT, f"\nContext type: {ctx_type}"]
    if ctx:
        parts.append(f"Context data: {_safe_context(ctx)}")
    parts.append(f"\nUser question: {message}")
    return "\n".join(parts)


def _safe_context(ctx: dict) -> str:
    blocked = ("key", "token", "secret", "password", "authorization", "bearer")
    sanitized = {
        str(key)[:80]: value
        for key, value in ctx.items()
        if not any(term in str(key).lower() for term in blocked)
    }
    return json.dumps(sanitized, ensure_ascii=True, default=str)[:1500]


async def _gemini(prompt: str) -> str:
    async with httpx.AsyncClient(timeout=settings.HTTP_TIMEOUT) as client:
        resp = await client.post(
            GEMINI_URL,
            params={"key": settings.GEMINI_API_KEY},
            json={"contents": [{"parts": [{"text": prompt}]}]},
        )
        if resp.status_code >= 400:
            logger.warning("Gemini %s: %s", resp.status_code, resp.text[:300])
            resp.raise_for_status()
        data = resp.json()
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()


async def _openai(prompt: str) -> str:
    async with httpx.AsyncClient(timeout=settings.HTTP_TIMEOUT) as client:
        resp = await client.post(
            OPENAI_URL,
            headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
            json={
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
            },
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"].strip()


_KB = {
    "apod": (
        "NASA's Astronomy Picture of the Day showcases a different cosmic image "
        "each day with an explanation from a professional astronomer. Subjects "
        "range from planets and nebulae to distant galaxies and rare events."
    ),
    "mars": (
        "Mars rover images come from robots like Curiosity and Perseverance. They "
        "use multiple cameras (NAVCAM, MAST, FHAZ) to study Martian geology, "
        "climate, and signs of past water - a key step in the search for ancient life."
    ),
    "planet": (
        "Planets are worlds orbiting a star. Rocky planets like Earth and Mars "
        "have solid surfaces, while gas giants like Jupiter are massive balls of "
        "hydrogen and helium. A planet's habitability depends on size, temperature, "
        "and distance from its star."
    ),
    "star": (
        "Stars are glowing spheres of plasma fusing hydrogen into helium. Their "
        "color reveals temperature: blue stars are hottest, red stars coolest. Our "
        "Sun is a medium yellow G-type star about 4.6 billion years old."
    ),
    "galaxy": (
        "A galaxy is a vast system of stars, gas, dust, and dark matter bound by "
        "gravity. The Milky Way holds 100-400 billion stars. Galaxies come in "
        "spiral, elliptical, and irregular shapes."
    ),
    "nebula": (
        "A nebula is a cloud of gas and dust in space. Some are stellar nurseries "
        "where new stars form; others are the glowing remains of dying stars."
    ),
    "black hole": (
        "A black hole is a region where gravity is so strong not even light escapes. "
        "They form when massive stars collapse. The boundary is the event horizon - "
        "once crossed, there is no return."
    ),
    "asteroid": (
        "Asteroids are rocky leftovers from the solar system's formation, mostly "
        "between Mars and Jupiter. Near-Earth asteroids are tracked closely; risk "
        "depends on size, speed, and how near they pass - but the vast majority pose "
        "no threat."
    ),
    "exoplanet": (
        "An exoplanet is a planet orbiting a star beyond our Sun. Over 5,500 are "
        "confirmed. Scientists assess potential habitability using size, mass, orbit, "
        "and equilibrium temperature - though these are estimates, not proof of life."
    ),
}


def _fallback(message: str, ctx_type: str, ctx: dict) -> str:
    text = (message + " " + ctx_type).lower()

    if "quiz" in text:
        return (
            "Here's a quick astronomy quiz:\n"
            "1. Which planet has the most moons?\n"
            "2. What is the closest star to Earth (besides the Sun)?\n"
            "3. True or false: a light-year measures time.\n\n"
            "Answers: 1) Saturn, 2) Proxima Centauri, 3) False - it measures distance. "
            "(Offline demo mode: configure an AI key for full conversational answers.)"
        )

    if "compare" in text or " vs " in text or "versus" in text:
        return (
            "Comparison tip: to compare two objects, look at their size, mass, "
            "temperature, and distance. For planets, smaller rocky worlds in the "
            "'habitable zone' are more Earth-like than hot gas giants close to their "
            "star. (Offline demo mode - add an AI key for tailored comparisons.)"
        )

    for key, answer in _KB.items():
        if key in text:
            extra = ""
            if ctx.get("name") or ctx.get("title"):
                extra = f" You asked in the context of '{ctx.get('name') or ctx.get('title')}'."
            return answer + extra + (
                "\n\n(Offline demo mode: set GEMINI_API_KEY or OPENAI_API_KEY in the "
                "backend for live AI responses.)"
            )

    return (
        "I'm AstroVision's astronomy assistant. I can explain planets, stars, galaxies, "
        "nebulae, black holes, asteroids, and exoplanets, generate a quiz, or compare "
        "objects. Ask me something specific!\n\n"
        "(Offline demo mode: configure an AI key for full conversational answers.)"
    )
