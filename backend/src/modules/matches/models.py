import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    String,
    UniqueConstraint,
    Uuid,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database.postgres.base import Base
from src.modules.users.models import User


class Match(Base):
    __tablename__ = "matches"
    __table_args__ = (
        CheckConstraint("user_a_id <> user_b_id", name="ck_match_distinct_users"),
        Index("ix_matches_user_a", "user_a_id", "started_at"),
        Index("ix_matches_user_b", "user_b_id", "started_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_a_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id", ondelete="CASCADE"))
    user_b_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id", ondelete="CASCADE"))
    hobbies: Mapped[list] = mapped_column(JSON, default=list)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user_a: Mapped[User] = relationship(foreign_keys=[user_a_id], lazy="selectin")
    user_b: Mapped[User] = relationship(foreign_keys=[user_b_id], lazy="selectin")


class MatchRequest(Base):
    __tablename__ = "match_requests"
    __table_args__ = (
        Index(
            "uq_match_requests_one_searching",
            "user_id",
            unique=True,
            postgresql_where=text("status = 'searching'"),
            sqlite_where=text("status = 'searching'"),
        ),
        CheckConstraint(
            "status IN ('searching','matched','cancelled','expired')", name="ck_request_status"
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id", ondelete="CASCADE"))
    hobbies: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(12), default="searching")
    match_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("matches.id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class MatchDecision(Base):
    __tablename__ = "match_decisions"
    __table_args__ = (
        UniqueConstraint("match_id", "user_id", name="uq_decision_per_user"),
        CheckConstraint("decision IN ('continue','leave')", name="ck_decision_value"),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    match_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("matches.id", ondelete="CASCADE"))
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id", ondelete="CASCADE"))
    decision: Mapped[str] = mapped_column(String(10))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
