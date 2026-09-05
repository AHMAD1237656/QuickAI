"""
AI provider abstraction.

This module is the single place that decides HOW a prompt gets turned into
generated text. It supports:

  * "demo" provider - no API key required. Produces clearly-labeled
    placeholder output so the whole platform (credits, history, UI) can be
    developed and tested locally without any real AI API key.

  * "openai" provider (or any OpenAI-compatible endpoint) - used when
    AI_API_KEY and AI_PROVIDER=openai are configured. Uses the standard
    OpenAI-compatible /chat/completions REST API via httpx, so no extra
    vendor SDK is required.

  * "gemini" provider - used when AI_PROVIDER=gemini is configured. Calls
    Google's Gemini API using the official `google-genai` SDK. Reads
    GEMINI_API_KEY / GEMINI_MODEL first, falling back to the generic
    AI_API_KEY / AI_MODEL variables so either naming convention works.

To add a new provider, add a new branch in `generate_text` and read any
extra configuration from environment variables - never hardcode secrets.
"""

import os
import httpx

AI_PROVIDER = os.getenv("AI_PROVIDER", "demo").lower()
AI_API_KEY = os.getenv("AI_API_KEY", "")
# Default model depends on the provider - each branch below picks its own
# sensible default if no model env var is set.
AI_MODEL = os.getenv("AI_MODEL", "")

# Gemini-specific env vars (preferred names per the project spec), with the
# generic AI_API_KEY / AI_MODEL used as a fallback so both naming styles work.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "") or AI_API_KEY
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "") or AI_MODEL or "gemini-2.5-flash"

# The active API key for whichever provider is configured - used by
# generate_text() to decide whether real credentials are present at all.
_ACTIVE_KEY = GEMINI_API_KEY if AI_PROVIDER == "gemini" else AI_API_KEY

# Per-tool system instructions. Keeping prompts centralized makes it easy
# to tune each tool's behaviour independently.
TOOL_INSTRUCTIONS = {
    "text-generator": "You are a helpful writing assistant. Generate high-quality text for the given prompt.",
    "blog-writer": "You are a professional blog writer. Write a well-structured blog post with a title, "
    "introduction, headed sections, and a conclusion based on the given topic, tone and length.",
    "email-writer": "You are a professional email writing assistant. Write a clear, well-formatted email "
    "based on the purpose, recipient and tone provided.",
    "summarizer": "You are a summarization assistant. Summarize the given text clearly and concisely, "
    "preserving the key points.",
    "grammar-checker": "You are a grammar and writing quality assistant. Correct grammar, spelling and "
    "phrasing issues in the given text, and briefly explain notable changes.",
    "paraphraser": "You are a paraphrasing assistant. Rewrite the given text in different words while "
    "keeping the original meaning intact.",
    "caption-generator": "You are a social media assistant. Generate an engaging, on-brand caption for "
    "the described post.",
    "hashtag-generator": "You are a social media assistant. Generate a list of relevant, effective "
    "hashtags for the described content.",
    "resume-assistant": "You are a professional resume writing assistant. Improve the given resume "
    "content and suggest specific enhancements.",
    "study-assistant": "You are a helpful study assistant. Explain the topic clearly, and where useful, "
    "provide organized notes or a short summary suitable for studying.",
}


def _demo_response(tool: str, prompt: str, options: dict) -> str:
    """
    Deterministic, clearly-labeled placeholder output.

    This lets the whole product (frontend, credits, history) be developed
    and demoed without any real AI provider configured or any API cost.
    """
    options_text = f" Options: {options}" if options else ""
    return (
        f"[DEMO MODE - no AI provider configured]\n\n"
        f"Tool: {tool}\n"
        f"This is placeholder output generated locally so you can test the "
        f"QuickAI platform end-to-end without an API key.{options_text}\n\n"
        f"Your input was:\n\"{prompt.strip()}\"\n\n"
        f"To get real AI-generated results, set AI_PROVIDER=gemini and "
        f"GEMINI_API_KEY in ai-service/.env (see .env.example)."
    )


def _build_user_message(tool: str, prompt: str, options: dict) -> str:
    if not options:
        return prompt
    option_lines = "\n".join(f"- {key}: {value}" for key, value in options.items())
    return f"{prompt}\n\nAdditional settings:\n{option_lines}"


async def _call_openai_compatible(tool: str, prompt: str, options: dict) -> str:
    """
    Calls an OpenAI-compatible /chat/completions endpoint using httpx.
    Works with OpenAI itself or any compatible-API provider by changing
    AI_BASE_URL.
    """
    base_url = os.getenv("AI_BASE_URL", "https://api.openai.com/v1")
    system_prompt = TOOL_INSTRUCTIONS.get(tool, "You are a helpful AI assistant.")
    user_message = _build_user_message(tool, prompt, options)
    model = AI_MODEL or "gpt-4o-mini"

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"{base_url}/chat/completions",
            headers={"Authorization": f"Bearer {AI_API_KEY}"},
            json={
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message},
                ],
            },
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


def _call_gemini_sync(tool: str, prompt: str, options: dict) -> str:
    """
    Calls Google's Gemini API using the official `google-genai` SDK.
    This runs the (synchronous) SDK call - see _call_gemini() for the
    async wrapper used by the rest of the service.
    """
    from google import genai
    from google.genai import types

    system_prompt = TOOL_INSTRUCTIONS.get(tool, "You are a helpful AI assistant.")
    user_message = _build_user_message(tool, prompt, options)

    client = genai.Client(api_key=GEMINI_API_KEY)
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=user_message,
        config=types.GenerateContentConfig(system_instruction=system_prompt),
    )

    text = getattr(response, "text", None)
    if not text:
        raise RuntimeError(f"Unexpected Gemini response shape: {response}")
    return text.strip()


async def _call_gemini(tool: str, prompt: str, options: dict) -> str:
    """
    Async wrapper around the google-genai SDK call. The SDK's synchronous
    client is run in a worker thread so it doesn't block the FastAPI
    event loop.
    """
    import asyncio

    return await asyncio.to_thread(_call_gemini_sync, tool, prompt, options)


async def generate_text(tool: str, prompt: str, options: dict) -> str:
    """Main entry point used by the router: dispatch to the configured provider."""
    if AI_PROVIDER == "demo" or not _ACTIVE_KEY:
        return _demo_response(tool, prompt, options)

    if AI_PROVIDER == "openai":
        return await _call_openai_compatible(tool, prompt, options)

    if AI_PROVIDER == "gemini":
        return await _call_gemini(tool, prompt, options)

    # Fallback: unknown provider configured - stay safe and use demo mode
    # rather than failing the whole request.
    return _demo_response(tool, prompt, options)
