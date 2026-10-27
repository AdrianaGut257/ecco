import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    String,
    UniqueConstraint,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database.postgres.base import Base
from src.modules.users.avatar import DEFAULT_AVATAR


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(40))
    username: Mapped[str] = mapped_column(String(20))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    avatar: Mapped[dict] = mapped_column(JSON, default=lambda: dict(DEFAULT_AVATAR))
    share_mood: Mapped[bool] = mapped_column(Boolean, default=True)
    terms_accepted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    email_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    interests: Mapped[list["UserInterest"]] = relationship(
        cascade="all, delete-orphan",
        lazy="selectin",
        order_by="UserInterest.name",
    )


Index("uq_users_username_lower", func.lower(User.username), unique=True)


class UserInterest(Base):
    __tablename__ = "user_interests"
    __table_args__ = (UniqueConstraint("user_id", "name", name="uq_user_interest"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(60))
    details: Mapped[dict | None] = mapped_column(JSON)
