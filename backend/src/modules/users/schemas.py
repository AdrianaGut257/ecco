import re
import uuid

from pydantic import Field, field_validator

from src.core.schemas import CamelModel
from src.modules.users.catalog import AVATAR_IDS, MAX_INTERESTS, MIN_INTERESTS
from src.modules.users.models import User

USERNAME_PATTERN = re.compile(r"^[\w.-]{2,20}$")


class UserOut(CamelModel):
    id: uuid.UUID
    username: str
    email: str
    avatar_id: str
    interests: list[str]


def to_user_out(user: User) -> UserOut:
    return UserOut(
        id=user.id,
        username=user.username,
        email=user.email,
        avatar_id=user.avatar_id,
        interests=sorted(interest.name for interest in user.interests),
    )


class ProfileUpdate(CamelModel):
    username: str | None = None
    avatar_id: str | None = None
    interests: list[str] | None = Field(default=None, max_length=MAX_INTERESTS)
    interest_details: dict[str, dict[str, list[str]]] | None = None
    terms_accepted: bool | None = None

    @field_validator("username")
    @classmethod
    def valid_username(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if not USERNAME_PATTERN.match(value):
            raise ValueError("Usa entre 2 y 20 letras o números, sin espacios.")
        return value

    @field_validator("avatar_id")
    @classmethod
    def valid_avatar(cls, value: str | None) -> str | None:
        if value is not None and value not in AVATAR_IDS:
            raise ValueError("Ese avatar no está disponible.")
        return value

    @field_validator("interests")
    @classmethod
    def valid_interests(cls, value: list[str] | None) -> list[str] | None:
        if value is None:
            return None
        cleaned = list(dict.fromkeys(i.strip() for i in value if i.strip()))
        if any(len(i) > 60 for i in cleaned):
            raise ValueError("Uno de los intereses es demasiado largo.")
        if len(cleaned) < MIN_INTERESTS:
            raise ValueError(
                f"Elige al menos {MIN_INTERESTS} intereses para encontrar buenas conexiones."
            )
        return cleaned
