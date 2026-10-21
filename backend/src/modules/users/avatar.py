from typing import Any, Literal

from pydantic import model_validator

from src.core.schemas import CamelModel

Swatch = Literal["1", "2", "3", "4", "5", "6"]
HairStyle = Literal[
    "flip", "bob", "long", "wavy", "halfBun", "bun",
    "pixie", "curly", "layered", "blunt", "straight", "volume",
]
Bangs = Literal["lock", "swept", "wispy", "middle", "full", "short", "straightCut", "choppy", "sweep"]

LEGACY_HAIR = {
    "short": ("bob", "swept"),
    "long": ("long", "wispy"),
    "curly": ("curly", "middle"),
    "bun": ("bun", "full"),
    "buzz": ("pixie", "short"),
}


class AvatarConfig(CamelModel):
    skin: Swatch = "2"
    hair: HairStyle = "bob"
    bangs: Bangs = "swept"
    hair_color: Swatch = "1"
    glasses: Literal["none", "round", "square", "wide"] = "none"
    earrings: Literal["none", "hoops", "small", "studs"] = "none"
    headband: bool = False
    freckles: bool = False
    mole: bool = False
    outfit: Literal["tee", "tank", "strap", "vneck"] = "tee"
    top: Swatch = "1"
    background: Swatch = "1"

    @model_validator(mode="before")
    @classmethod
    def upgrade_legacy(cls, data: Any) -> Any:
        """Traduce avatares guardados con opciones que ya no existen (peinados viejos, `earring` booleano, chompa)."""
        if not isinstance(data, dict):
            return data
        data = dict(data)
        if data.get("hair") in LEGACY_HAIR and "bangs" not in data:
            data["hair"], data["bangs"] = LEGACY_HAIR[data["hair"]]
        if "earring" in data and "earrings" not in data:
            data["earrings"] = "studs" if data.pop("earring") else "none"
        if data.get("outfit") == "sweater":
            data["outfit"] = "tee"
        return data


DEFAULT_AVATAR = AvatarConfig().model_dump()


def avatar_from(raw: dict | None) -> AvatarConfig:
    try:
        return AvatarConfig.model_validate(raw or {})
    except ValueError:
        return AvatarConfig()
