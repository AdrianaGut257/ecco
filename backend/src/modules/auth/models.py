import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column

from src.database.postgres.base import Base


class EmailCode(Base):
    """Código de 6 dígitos enviado por correo: verificar el correo (`verify`) o recuperar la contraseña (`reset`)."""

    __tablename__ = "email_codes"
    __table_args__ = (Index("ix_email_codes_user_purpose", "user_id", "purpose"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id", ondelete="CASCADE"))
    purpose: Mapped[str] = mapped_column(String(16))
    code_hash: Mapped[str] = mapped_column(String(64))
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
