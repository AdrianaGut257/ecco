from datetime import datetime
from typing import Literal

from pydantic import field_validator

from src.core.schemas import CamelModel

MAX_MESSAGE_LENGTH = 500


class MessageIn(CamelModel):
    text: str
    confirmed: bool = False

    @field_validator("text")
    @classmethod
    def valid_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Escribe algo antes de enviar.")
        if len(value) > MAX_MESSAGE_LENGTH:
            raise ValueError(f"Tu mensaje puede tener hasta {MAX_MESSAGE_LENGTH} caracteres.")
        return value


class MessageOut(CamelModel):
    id: str
    match_id: str
    text: str
    from_me: bool
    day: int
    created_at: datetime
    status: Literal["sent"] = "sent"
