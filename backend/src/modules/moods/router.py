from datetime import timedelta

from fastapi import APIRouter, Query, status
from sqlalchemy import select

from src.core.deps import CurrentUser, DbSession
from src.core.time import utcnow
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


@router.get("/me", response_model=list[MoodOut])
async def my_moods(user: CurrentUser, db: DbSession, days: int = Query(default=7, ge=1, le=60)):
    stmt = (
        select(MoodEntry)
        .where(
            MoodEntry.user_id == user.id,
            MoodEntry.created_at > utcnow() - timedelta(days=days),
        )
        .order_by(MoodEntry.created_at)
    )
    return (await db.execute(stmt)).scalars().all()
