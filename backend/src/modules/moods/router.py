from fastapi import APIRouter, status

from src.core.deps import CurrentUser, DbSession
from src.modules.moods.models import MoodEntry
from src.modules.moods.schemas import MoodIn, MoodOut

router = APIRouter(prefix="/moods", tags=["Moods"])


@router.post("", response_model=MoodOut, status_code=status.HTTP_201_CREATED)
async def save_mood(data: MoodIn, user: CurrentUser, db: DbSession):
    entry = MoodEntry(user_id=user.id, mood=data.mood)
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry
