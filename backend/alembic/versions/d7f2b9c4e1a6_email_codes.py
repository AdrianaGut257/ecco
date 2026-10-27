"""email codes for verification and password reset

Revision ID: d7f2b9c4e1a6
Revises: c5e8a1d3f7b2
Create Date: 2026-10-27 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "d7f2b9c4e1a6"
down_revision: Union[str, Sequence[str], None] = "c5e8a1d3f7b2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("email_verified_at", sa.DateTime(timezone=True), nullable=True))
    # Las cuentas que ya existían no quedan bloqueadas.
    op.execute("UPDATE users SET email_verified_at = now()")

    op.create_table(
        "email_codes",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("purpose", sa.String(length=16), nullable=False),
        sa.Column("code_hash", sa.String(length=64), nullable=False),
        sa.Column("attempts", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_email_codes_user_purpose", "email_codes", ["user_id", "purpose"])
    op.drop_table("password_reset_tokens")


def downgrade() -> None:
    op.create_table(
        "password_reset_tokens",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("token_hash", sa.String(length=64), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("token_hash"),
    )
    op.create_index("ix_password_reset_tokens_user_id", "password_reset_tokens", ["user_id"])
    op.drop_index("ix_email_codes_user_purpose", table_name="email_codes")
    op.drop_table("email_codes")
    op.drop_column("users", "email_verified_at")
