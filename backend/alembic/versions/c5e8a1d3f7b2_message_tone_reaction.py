"""message tone and reaction

Revision ID: c5e8a1d3f7b2
Revises: b41c7e2a9f10
Create Date: 2026-10-21 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c5e8a1d3f7b2"
down_revision: Union[str, Sequence[str], None] = "b41c7e2a9f10"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("messages", sa.Column("tone", sa.String(length=16), nullable=True))
    op.add_column("messages", sa.Column("reaction", sa.String(length=16), nullable=True))
    op.add_column("messages", sa.Column("reacted_at", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column("messages", "reacted_at")
    op.drop_column("messages", "reaction")
    op.drop_column("messages", "tone")
