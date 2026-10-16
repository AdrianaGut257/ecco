import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column

from src.database.postgres.base import Base

MOODS = ("fatal", "mal", "normal", "bien", "feliz")


class MoodEntry(Base):
    __tablename__ = "mood_entries"
    __table_args__ = (
        CheckConstraint("mood IN ('fatal','mal','normal','bien','feliz')", name="ck_mood_value"),
        Index("ix_mood_entries_user_created", "user_id", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id", ondelete="CASCADE"))
    mood: Mapped[str] = mapped_column(String(10))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
