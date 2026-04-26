"""LLM client with provider auto-selection (Gemini/OpenAI/Groq/Anthropic/Ollama)."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

import httpx

from app.core.config import (
    ANTHROPIC_API_KEY,
    EG_ANTHROPIC_BASE_URL,
    EG_ANTHROPIC_MODEL,
    EG_GEMINI_MODEL,
    EG_GROQ_BASE_URL,
    EG_GROQ_MODEL,
    EG_LLM_PROVIDER,
    EG_OLLAMA_MODEL,
    EG_OLLAMA_TIMEOUT,
    EG_OLLAMA_URL,
    EG_OPENAI_MODEL,
    GEMINI_API_KEY,
    GROQ_API_KEY,
    OPENAI_API_KEY,
    OPENAI_BASE_URL,
)

logger = logging.getLogger("echogarden.llm")

_JSON_INSTRUCTION = "Return ONLY valid raw JSON. Do not use markdown code fences."
_AUTO_PROVIDER_ORDER = ("gemini", "openai", "groq", "anthropic", "ollama")
_SUPPORTED_PROVIDERS = {"auto", "gemini", "openai", "groq", "anthropic", "ollama"}


class LLMUnavailableError(Exception):
    """Raised when no configured LLM backend is available."""


def _resolve_provider() -> str | None:
    provider = (EG_LLM_PROVIDER or "auto").strip().lower()
    if provider not in _SUPPORTED_PROVIDERS:
        return None
    if provider != "auto":
        return provider
    for candidate in _AUTO_PROVIDER_ORDER:
        if _is_configured(candidate):
            return candidate
    return None


def _is_configured(provider: str) -> bool:
    if provider == "gemini":
        return bool(GEMINI_API_KEY)
    if provider == "openai":
        return bool(OPENAI_API_KEY and OPENAI_BASE_URL)
    if provider == "groq":
        return bool(GROQ_API_KEY and EG_GROQ_BASE_URL)
    if provider == "anthropic":
        return bool(ANTHROPIC_API_KEY and EG_ANTHROPIC_BASE_URL)
    if provider == "ollama":
        return bool(EG_OLLAMA_URL)
    return False


def _provider_model(provider: str) -> str:
    if provider == "gemini":
        return EG_GEMINI_MODEL
    if provider == "openai":
        return EG_OPENAI_MODEL
    if provider == "groq":
        return EG_GROQ_MODEL
    if provider == "anthropic":
        return EG_ANTHROPIC_MODEL
    if provider == "ollama":
        return EG_OLLAMA_MODEL
    return ""


def _provider_endpoint(provider: str) -> str:
    if provider == "gemini":
        return "https://generativelanguage.googleapis.com"
    if provider == "openai":
        return OPENAI_BASE_URL
    if provider == "groq":
        return EG_GROQ_BASE_URL
    if provider == "anthropic":
        return EG_ANTHROPIC_BASE_URL
    if provider == "ollama":
        return EG_OLLAMA_URL
    return ""


def current_llm_backend() -> dict[str, str]:
    """Return active LLM backend metadata for status/debug endpoints."""
    provider = _resolve_provider() or "none"
    return {
        "provider": provider,
        "model": _provider_model(provider) if provider != "none" else "",
        "endpoint": _provider_endpoint(provider) if provider != "none" else "",
    }


def _extract_text_content(content: Any) -> str:
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        chunks: list[str] = []
        for item in content:
            if isinstance(item, str):
                chunks.append(item)
            elif isinstance(item, dict):
                text = item.get("text")
                if isinstance(text, str):
                    chunks.append(text)
        return "\n".join(c for c in chunks if c).strip()
    return str(content).strip()


async def ping_ollama() -> bool:
    if not EG_OLLAMA_URL:
        return False
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{EG_OLLAMA_URL}/api/tags")
            return response.status_code == 200
    except Exception:
        return False


async def check_llm_health() -> bool:
    """Check if the currently resolved LLM provider is available.
    
    For cloud providers, this checks if the API key is configured.
    For local Ollama, it pings the service.
    """
    provider = _resolve_provider()
    if not provider:
        return False
    if provider == "ollama":
        return await ping_ollama()
    return _is_configured(provider)


async def _gemini_generate(
    prompt: str,
    *,
    system: str | None,
    expect_json: bool,
) -> str:
    try:
        from google import genai
        from google.genai import types
    except ImportError as exc:
        raise LLMUnavailableError("google-genai is not installed.") from exc

    full_prompt = f"{system}\n\n{prompt}" if system else prompt
    if expect_json:
        full_prompt = f"{_JSON_INSTRUCTION}\n\n{full_prompt}"

    def _call() -> str:
        client = genai.Client(api_key=GEMINI_API_KEY)
        kwargs: dict[str, Any] = {}
        if expect_json:
            kwargs["config"] = types.GenerateContentConfig(response_mime_type="application/json")
        response = client.models.generate_content(
            model=EG_GEMINI_MODEL,
            contents=full_prompt,
            **kwargs,
        )
        return (response.text or "").strip()

    try:
        return await asyncio.to_thread(_call)
    except Exception as exc:
        raise LLMUnavailableError(
            f"Gemini API error (model={EG_GEMINI_MODEL}): {exc}. "
            f"Check that GEMINI_API_KEY is valid and the model name is correct."
        ) from exc


async def _openai_compatible_generate(
    *,
    base_url: str,
    api_key: str,
    model: str,
    provider_name: str,
    prompt: str,
    system: str | None,
    timeout: float,
    num_predict: int | None,
    expect_json: bool,
) -> str:
    user_prompt = f"{_JSON_INSTRUCTION}\n\n{prompt}" if expect_json else prompt
    messages: list[dict[str, str]] = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": user_prompt})

    body: dict[str, Any] = {
        "model": model,
        "messages": messages,
        "stream": False,
    }
    if num_predict is not None:
        body["max_tokens"] = num_predict
    if expect_json:
        body["response_format"] = {"type": "json_object"}

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    url = f"{base_url.rstrip('/')}/chat/completions"

    async def _send(payload: dict[str, Any]) -> httpx.Response:
        async with httpx.AsyncClient(timeout=timeout) as client:
            return await client.post(url, json=payload, headers=headers)

    try:
        response = await _send(body)
        if expect_json and response.status_code in (400, 422):
            fallback_body = dict(body)
            fallback_body.pop("response_format", None)
            response = await _send(fallback_body)
        response.raise_for_status()
        data = response.json()
        choices = data.get("choices") or []
        if not choices:
            raise LLMUnavailableError(f"{provider_name} returned no choices.")
        content = choices[0].get("message", {}).get("content", "")
        return _extract_text_content(content)
    except httpx.HTTPError as exc:
        raise LLMUnavailableError(f"{provider_name} HTTP error: {exc}") from exc
    except Exception as exc:
        raise LLMUnavailableError(f"{provider_name} error: {exc}") from exc


async def _anthropic_generate(
    *,
    prompt: str,
    system: str | None,
    timeout: float,
    num_predict: int | None,
    expect_json: bool,
) -> str:
    user_prompt = f"{_JSON_INSTRUCTION}\n\n{prompt}" if expect_json else prompt
    body: dict[str, Any] = {
        "model": EG_ANTHROPIC_MODEL,
        "messages": [{"role": "user", "content": user_prompt}],
        "max_tokens": num_predict or 1024,
    }
    if system:
        body["system"] = system

    url = f"{EG_ANTHROPIC_BASE_URL.rstrip('/')}/messages"
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(url, json=body, headers=headers)
            response.raise_for_status()
            data = response.json()
            content = data.get("content", [])
            return _extract_text_content(content)
    except httpx.HTTPError as exc:
        raise LLMUnavailableError(f"Anthropic HTTP error: {exc}") from exc
    except Exception as exc:
        raise LLMUnavailableError(f"Anthropic error: {exc}") from exc


async def _ollama_generate(
    prompt: str,
    *,
    system: str | None,
    timeout: float,
    num_predict: int | None,
    expect_json: bool,
) -> str:
    if not EG_OLLAMA_URL:
        raise LLMUnavailableError("EG_OLLAMA_URL is not configured.")

    body: dict[str, Any] = {
        "model": EG_OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
    }
    if system:
        body["system"] = system
    if expect_json:
        body["format"] = "json"
    if num_predict is not None:
        body.setdefault("options", {})["num_predict"] = num_predict

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(f"{EG_OLLAMA_URL}/api/generate", json=body)
            response.raise_for_status()
            return response.json().get("response", "").strip()
    except httpx.HTTPError as exc:
        raise LLMUnavailableError(f"Ollama HTTP error: {exc}") from exc
    except Exception as exc:
        raise LLMUnavailableError(f"Ollama error: {exc}") from exc


async def ollama_generate(
    prompt: str,
    *,
    system: str | None = None,
    timeout: float = EG_OLLAMA_TIMEOUT,
    num_predict: int | None = None,
) -> str:
    """Generate text using the active configured LLM backend."""
    provider = _resolve_provider()
    if not provider:
        raise LLMUnavailableError(
            "No LLM backend configured. Set EG_LLM_PROVIDER or provider API keys."
        )

    if provider == "gemini":
        if not GEMINI_API_KEY:
            raise LLMUnavailableError("GEMINI_API_KEY is not configured.")
        return await _gemini_generate(prompt, system=system, expect_json=False)

    if provider == "openai":
        if not OPENAI_API_KEY:
            raise LLMUnavailableError("OPENAI_API_KEY is not configured.")
        return await _openai_compatible_generate(
            base_url=OPENAI_BASE_URL,
            api_key=OPENAI_API_KEY,
            model=EG_OPENAI_MODEL,
            provider_name="OpenAI",
            prompt=prompt,
            system=system,
            timeout=timeout,
            num_predict=num_predict,
            expect_json=False,
        )

    if provider == "groq":
        if not GROQ_API_KEY:
            raise LLMUnavailableError("GROQ_API_KEY is not configured.")
        return await _openai_compatible_generate(
            base_url=EG_GROQ_BASE_URL,
            api_key=GROQ_API_KEY,
            model=EG_GROQ_MODEL,
            provider_name="Groq",
            prompt=prompt,
            system=system,
            timeout=timeout,
            num_predict=num_predict,
            expect_json=False,
        )

    if provider == "anthropic":
        if not ANTHROPIC_API_KEY:
            raise LLMUnavailableError("ANTHROPIC_API_KEY is not configured.")
        return await _anthropic_generate(
            prompt=prompt,
            system=system,
            timeout=timeout,
            num_predict=num_predict,
            expect_json=False,
        )

    if provider == "ollama":
        return await _ollama_generate(
            prompt,
            system=system,
            timeout=timeout,
            num_predict=num_predict,
            expect_json=False,
        )

    raise LLMUnavailableError(f"Unsupported LLM provider: {provider}")


async def ollama_generate_json(
    prompt: str,
    *,
    system: str | None = None,
    timeout: float = EG_OLLAMA_TIMEOUT,
    num_predict: int | None = None,
) -> str:
    """Generate JSON text using the active configured LLM backend."""
    provider = _resolve_provider()
    if not provider:
        raise LLMUnavailableError(
            "No LLM backend configured. Set EG_LLM_PROVIDER or provider API keys."
        )

    if provider == "gemini":
        if not GEMINI_API_KEY:
            raise LLMUnavailableError("GEMINI_API_KEY is not configured.")
        return await _gemini_generate(prompt, system=system, expect_json=True)

    if provider == "openai":
        if not OPENAI_API_KEY:
            raise LLMUnavailableError("OPENAI_API_KEY is not configured.")
        return await _openai_compatible_generate(
            base_url=OPENAI_BASE_URL,
            api_key=OPENAI_API_KEY,
            model=EG_OPENAI_MODEL,
            provider_name="OpenAI",
            prompt=prompt,
            system=system,
            timeout=timeout,
            num_predict=num_predict,
            expect_json=True,
        )

    if provider == "groq":
        if not GROQ_API_KEY:
            raise LLMUnavailableError("GROQ_API_KEY is not configured.")
        return await _openai_compatible_generate(
            base_url=EG_GROQ_BASE_URL,
            api_key=GROQ_API_KEY,
            model=EG_GROQ_MODEL,
            provider_name="Groq",
            prompt=prompt,
            system=system,
            timeout=timeout,
            num_predict=num_predict,
            expect_json=True,
        )

    if provider == "anthropic":
        if not ANTHROPIC_API_KEY:
            raise LLMUnavailableError("ANTHROPIC_API_KEY is not configured.")
        return await _anthropic_generate(
            prompt=prompt,
            system=system,
            timeout=timeout,
            num_predict=num_predict,
            expect_json=True,
        )

    if provider == "ollama":
        return await _ollama_generate(
            prompt,
            system=system,
            timeout=timeout,
            num_predict=num_predict,
            expect_json=True,
        )

    raise LLMUnavailableError(f"Unsupported LLM provider: {provider}")


async def llm_available() -> bool:
    """Check whether an LLM backend is configured and reachable (for Ollama)."""
    provider = _resolve_provider()
    if not provider:
        return False
    if provider == "ollama":
        return await ping_ollama()
    return _is_configured(provider)
