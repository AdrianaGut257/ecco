from datetime import datetime

from src.core.schemas import CamelModel
from src.modules.chat.schemas import Tone
from src.modules.matches.schemas import CommonInterestOut, MatchStatus, SharedFavoriteOut
from src.modules.moods.schemas import MoodValue
from src.modules.users.avatar import AvatarConfig


class GardenEntryOut(CamelModel):
    id: str
    partner_name: str
    partner_avatar: AvatarConfig
    stage: int
    status: MatchStatus
    started_at: datetime


class FirstMessageOut(CamelModel):
    text: str
    from_me: bool


class MemoryOut(GardenEntryOut):
    hobbies: list[str]
    shared_favorites: list[SharedFavoriteOut]
    common_interests: list[CommonInterestOut]
    # Reacciones que se regalaron, de la más usada a la menos (sin cantidades).
    reactions: list[MoodValue]
    tone: Tone | None
    first_message: FirstMessageOut | None
