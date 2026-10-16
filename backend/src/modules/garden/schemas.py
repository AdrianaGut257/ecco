from datetime import datetime

from src.core.schemas import CamelModel


class GardenEntryOut(CamelModel):
    id: str
    partner_name: str
    stage: int
    started_at: datetime
