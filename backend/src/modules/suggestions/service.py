import logging
import time

import httpx

from src.config.config import settings
from src.modules.suggestions.catalog import types_for
from src.modules.suggestions.schemas import SuggestionOut
from src.modules.users.details import normalize

logger = logging.getLogger(__name__)

KG_URL = "https://kgsearch.googleapis.com/v1/entities:search"
LIMIT = 6
CACHE_TTL_SECONDS = 60 * 60 * 24
CACHE_MAX = 2000

_cache: dict[tuple[str, str], tuple[float, list[SuggestionOut]]] = {}
_client: httpx.AsyncClient | None = None


def _http() -> httpx.AsyncClient:
    global _client
    if _client is None or _client.is_closed:
        _client = httpx.AsyncClient(timeout=4)
    return _client


async def close_client() -> None:
    if _client is not None:
        await _client.aclose()


async def fetch_entities(query: str, types: list[str]) -> list[dict]:
    params: list[tuple[str, str]] = [
        ("query", query),
        ("key", settings.google_kg_api_key or ""),
        ("languages", "es"),
        ("prefix", "true"),
        ("limit", str(LIMIT + 4)),
        *[("types", t) for t in types],
    ]
    response = await _http().get(KG_URL, params=params)
    response.raise_for_status()
    return response.json().get("itemListElement", [])


def _to_suggestions(elements: list[dict]) -> list[SuggestionOut]:
    seen: set[str] = set()
    result: list[SuggestionOut] = []
    for element in elements:
        entity = element.get("result", {})
        name = (entity.get("name") or "").strip()
        key = normalize(name)
        if not name or key in seen or len(name) > 80:
            continue
        seen.add(key)
        result.append(SuggestionOut(name=name, description=entity.get("description")))
        if len(result) == LIMIT:
            break
    return result


async def suggest(query: str, interest: str) -> list[SuggestionOut]:
    if not settings.google_kg_api_key:
        return []

    cache_key = (interest, normalize(query))
    cached = _cache.get(cache_key)
    if cached and time.monotonic() - cached[0] < CACHE_TTL_SECONDS:
        return cached[1]

    try:
        suggestions = _to_suggestions(await fetch_entities(query, types_for(interest)))
    except (httpx.HTTPError, ValueError):
        logger.warning("No se pudieron obtener sugerencias para %r", query, exc_info=True)
        return []

    if len(_cache) >= CACHE_MAX:
        _cache.clear()
    _cache[cache_key] = (time.monotonic(), suggestions)
    return suggestions


def clear_cache() -> None:
    _cache.clear()
