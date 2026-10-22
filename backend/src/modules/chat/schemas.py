from datetime import datetime
from typing import Literal

from pydantic import field_validator

from src.core.schemas import CamelModel
from src.modules.moods.schemas import MoodValue

MAX_MESSAGE_LENGTH = 500

Tone = Literal["warm", "joke", "cheer", "curious", "thanks", "serious"]


class MessageIn(CamelModel):
    text: str
    confirmed: bool = False
    tone: Tone | None = None

    @field_validator("text")
    @classmethod
    def valid_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Escribe algo antes de enviar.")
        if len(value) > MAX_MESSAGE_LENGTH:
            raise ValueError(f"Tu mensaje puede tener hasta {MAX_MESSAGE_LENGTH} caracteres.")
        return value


class ReactionIn(CamelModel):
    reaction: MoodValue | None = None


class MessageOut(CamelModel):
    id: str
    match_id: str
    text: str
    from_me: bool
    day: int
    created_at: datetime
    tone: Tone | None = None
    reaction: MoodValue | None = None
    reacted_at: datetime | None = None
    status: Literal["sent"] = "sent"
