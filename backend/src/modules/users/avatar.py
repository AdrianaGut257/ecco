from typing import Literal

from src.core.schemas import CamelModel

Swatch = Literal["1", "2", "3", "4", "5", "6"]


class AvatarConfig(CamelModel):
    skin: Swatch = "2"
    hair: Literal["short", "long", "curly", "bun", "buzz"] = "short"
    hair_color: Swatch = "2"
    glasses: Literal["none", "round", "square"] = "none"
    freckles: bool = False
    mole: bool = False
    earring: bool = False
    top: Swatch = "1"
    background: Swatch = "1"


DEFAULT_AVATAR = AvatarConfig().model_dump()


def avatar_from(raw: dict | None) -> AvatarConfig:
    try:
        return AvatarConfig.model_validate(raw or {})
    except ValueError:
        return AvatarConfig()
