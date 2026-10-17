"""customizable avatar, mood sharing, match endings and reports

Revision ID: b41c7e2a9f10
Revises: 9d279dfc8d27
Create Date: 2026-10-16 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b41c7e2a9f10"
down_revision: Union[str, Sequence[str], None] = "9d279dfc8d27"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("avatar", sa.JSON(), nullable=False, server_default=sa.text("'{}'")))
    op.add_column("users", sa.Column("share_mood", sa.Boolean(), nullable=False, server_default=sa.true()))
    op.drop_column("users", "avatar_id")

    op.add_column("matches", sa.Column("ended_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("matches", sa.Column("ended_by_id", sa.Uuid(), nullable=True))
    op.create_foreign_key(
        "fk_matches_ended_by", "matches", "users", ["ended_by_id"], ["id"], ondelete="SET NULL"
    )

    op.create_table(
        "reports",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("match_id", sa.Uuid(), nullable=False),
        sa.Column("reporter_id", sa.Uuid(), nullable=False),
        sa.Column("reported_id", sa.Uuid(), nullable=False),
        sa.Column("reason", sa.String(length=20), nullable=False),
        sa.Column("note", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["match_id"], ["matches.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["reporter_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["reported_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("reports")
    op.drop_constraint("fk_matches_ended_by", "matches", type_="foreignkey")
    op.drop_column("matches", "ended_by_id")
    op.drop_column("matches", "ended_at")
    op.add_column(
        "users",
        sa.Column("avatar_id", sa.String(length=10), nullable=False, server_default="a1"),
    )
    op.drop_column("users", "share_mood")
    op.drop_column("users", "avatar")
