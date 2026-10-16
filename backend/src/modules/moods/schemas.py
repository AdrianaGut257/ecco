from datetime import datetime
from typing import Literal

from src.core.schemas import CamelModel

MoodValue = Literal["fatal", "mal", "normal", "bien", "feliz"]


class MoodIn(CamelModel):
    mood: MoodValue


class MoodOut(CamelModel):
    mood: MoodValue
    created_at: datetime
