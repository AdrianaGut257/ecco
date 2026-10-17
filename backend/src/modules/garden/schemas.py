from datetime import datetime

from src.core.schemas import CamelModel
from src.modules.matches.schemas import MatchStatus
from src.modules.users.avatar import AvatarConfig


class GardenEntryOut(CamelModel):
    id: str
    partner_name: str
    partner_avatar: AvatarConfig
    stage: int
    status: MatchStatus
    started_at: datetime
