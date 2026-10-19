import re
import uuid

from pydantic import Field, field_validator

from src.core.moderation import classify
from src.core.schemas import CamelModel
from src.modules.users.avatar import AvatarConfig, avatar_from
from src.modules.users.catalog import MAX_INTERESTS, MIN_INTERESTS
from src.modules.users.details import InterestDetails, clean_details
from src.modules.users.models import User

USERNAME_PATTERN = re.compile(r"^[\w.-]{2,20}$")


class UserOut(CamelModel):
    id: uuid.UUID
    username: str
    email: str
    avatar: AvatarConfig
    interests: list[str]
    interest_details: InterestDetails
    share_mood: bool
    onboarded: bool


def is_onboarded(user: User) -> bool:
    return user.terms_accepted_at is not None and len(user.interests) >= MIN_INTERESTS


def to_user_out(user: User) -> UserOut:
    return UserOut(
        id=user.id,
        username=user.username,
        email=user.email,
        avatar=avatar_from(user.avatar),
        interests=sorted(interest.name for interest in user.interests),
        interest_details={i.name: i.details for i in user.interests if i.details},
        share_mood=user.share_mood,
        onboarded=is_onboarded(user),
    )


class ProfileUpdate(CamelModel):
    username: str | None = None
    avatar: AvatarConfig | None = None
    interests: list[str] | None = Field(default=None, max_length=MAX_INTERESTS)
    interest_details: InterestDetails | None = None
    terms_accepted: bool | None = None
    share_mood: bool | None = None

    @field_validator("username")
    @classmethod
    def valid_username(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if not USERNAME_PATTERN.match(value):
            raise ValueError("Usa entre 2 y 20 letras o números, sin espacios.")
        if classify(value) != "ok":
            raise ValueError("Elige un nombre que cuide a los demás.")
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

    @field_validator("interest_details")
    @classmethod
    def valid_details(cls, value: InterestDetails | None) -> InterestDetails | None:
        return None if value is None else clean_details(value)
