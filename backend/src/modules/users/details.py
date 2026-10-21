import unicodedata

GENERAL = "general"
MAX_SUBTOPICS = 15
MAX_ITEMS = 15
MAX_SUBTOPIC_LENGTH = 40
MAX_ITEM_LENGTH = 80

InterestDetails = dict[str, dict[str, list[str]]]


def normalize(text: str) -> str:
    decomposed = unicodedata.normalize("NFKD", text.strip().casefold())
    return " ".join("".join(c for c in decomposed if not unicodedata.combining(c)).split())


def _unique(values: list[str], max_length: int, limit: int) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        value = " ".join(value.split())
        key = normalize(value)
        if not key or key in seen:
            continue
        if len(value) > max_length:
            raise ValueError(f"«{value[:20]}…» es demasiado largo.")
        seen.add(key)
        result.append(value)
    if len(result) > limit:
        raise ValueError(f"Puedes agregar hasta {limit} elementos por tema.")
    return result


def clean_details(raw: InterestDetails) -> InterestDetails:
    cleaned: InterestDetails = {}
    for interest, buckets in raw.items():
        subtopics = [s for s in buckets if s != GENERAL]
        if len(subtopics) > MAX_SUBTOPICS:
            raise ValueError(f"Puedes elegir hasta {MAX_SUBTOPICS} subtemas por interés.")
        result: dict[str, list[str]] = {}
        for subtopic, items in buckets.items():
            name = " ".join(subtopic.split())
            if not name or len(name) > MAX_SUBTOPIC_LENGTH:
                raise ValueError("Uno de los subtemas no es válido.")
            result[name] = _unique(items, MAX_ITEM_LENGTH, MAX_ITEMS)
        if result:
            cleaned[interest.strip()] = result
    return cleaned


def subtopics_of(details: dict | None) -> dict[str, str]:
    return {normalize(k): k for k in (details or {}) if k != GENERAL}


def items_of(details: dict | None) -> dict[str, str]:
    found: dict[str, str] = {}
    for items in (details or {}).values():
        for item in items:
            found.setdefault(normalize(item), item)
    return found
