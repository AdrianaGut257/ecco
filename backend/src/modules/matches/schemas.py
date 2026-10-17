from datetime import datetime
from typing import Literal

from pydantic import field_validator

from src.core.schemas import CamelModel
from src.modules.matches.constants import HOBBIES, MAX_HOBBIES, REPORT_REASONS
from src.modules.moods.schemas import MoodValue
from src.modules.users.avatar import AvatarConfig

MatchStatus = Literal["active", "deciding", "waiting", "bloomed", "rested", "closed"]


class PartnerOut(CamelModel):
    username: str
    avatar: AvatarConfig
    mood: MoodValue | None = None


class CommonInterestOut(CamelModel):
    category: str
    items: list[str]


class MatchOut(CamelModel):
    id: str
    partner: PartnerOut
    common_interests: list[CommonInterestOut]
    hobbies: list[str]
    started_at: datetime
    day: int
    stage: int
    status: MatchStatus
    can_write: bool
    messages_left: int


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
    hobbies: list[str] = []


class DecisionIn(CamelModel):
    decision: Literal["continue", "leave"]


class EndIn(CamelModel):
    reason: str | None = None
    note: str | None = None

    @field_validator("reason")
    @classmethod
    def valid_reason(cls, value: str | None) -> str | None:
        if value is not None and value not in REPORT_REASONS:
            raise ValueError("Elige uno de los motivos de la lista.")
        return value

    @field_validator("note")
    @classmethod
    def short_note(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if len(value) > 500:
            raise ValueError("Tu comentario puede tener hasta 500 caracteres.")
        return value or None
