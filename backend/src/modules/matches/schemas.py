from datetime import datetime
from typing import Literal

from pydantic import field_validator

from src.core.schemas import CamelModel
from src.modules.matches.constants import HOBBIES, MAX_HOBBIES


class PartnerOut(CamelModel):
    username: str
    avatar_id: str


class CommonInterestOut(CamelModel):
    category: str
    items: list[str]


class MatchOut(CamelModel):
    id: str
    partner: PartnerOut
    common_interests: list[CommonInterestOut]
    started_at: datetime
    day: int


class SearchIn(CamelModel):
    hobbies: list[str]

    @field_validator("hobbies")
    @classmethod
    def valid_hobbies(cls, value: list[str]) -> list[str]:
        cleaned = list(dict.fromkeys(h.strip() for h in value))
        if not cleaned:
            raise ValueError("Elige al menos una afición para esta semana.")
        if len(cleaned) > MAX_HOBBIES:
            raise ValueError(f"Puedes elegir hasta {MAX_HOBBIES} aficiones.")
        if any(h not in HOBBIES for h in cleaned):
            raise ValueError("Una de las aficiones no está disponible.")
        return cleaned


class SearchOut(CamelModel):
    status: Literal["idle", "searching", "matched"]
    match: MatchOut | None = None


class DecisionIn(CamelModel):
    decision: Literal["continue", "leave"]
