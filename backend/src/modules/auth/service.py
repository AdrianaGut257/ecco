from datetime import timedelta

from fastapi import BackgroundTasks
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.config.config import settings
from src.core import mail
from src.core.errors import BadRequest, Conflict, Forbidden, Unauthorized
from src.core.security import (
    create_access_token,
    hash_password,
    hash_token,
    new_reset_token,
    verify_password,
)
from src.core.time import utcnow
from src.modules.auth.models import PasswordResetToken
from src.modules.auth.schemas import AuthOut, LoginIn, RegisterIn
from src.modules.users.models import User
from src.modules.users.schemas import to_user_out
from src.modules.users.service import generate_username

EMAIL_TAKEN = "Ya existe una cuenta con ese correo. ¿Quieres iniciar sesión?"
BAD_CREDENTIALS = "El correo o la contraseña no coinciden. Prueba de nuevo."
INVALID_RESET = "El enlace venció o ya se usó. Pide uno nuevo cuando quieras."


def _auth_out(user: User) -> AuthOut:
    return AuthOut(access_token=create_access_token(user.id), user=to_user_out(user))


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    return (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()


async def register(db: AsyncSession, data: RegisterIn) -> AuthOut:
    if await get_user_by_email(db, data.email):
        raise Conflict(EMAIL_TAKEN)

    user = User(
        name=data.name,
        username=await generate_username(db, data.name),
        email=data.email,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise Conflict(EMAIL_TAKEN)

    await db.refresh(user)
    return _auth_out(user)


async def login(db: AsyncSession, data: LoginIn) -> AuthOut:
    user = await get_user_by_email(db, data.email)
    valid = verify_password(data.password, user.password_hash if user else None)
    if not user or not valid:
        raise Unauthorized(BAD_CREDENTIALS)
    if not user.is_active:
        raise Forbidden("Tu cuenta está pausada. Escríbenos y te ayudamos.")
    return _auth_out(user)


async def request_password_reset(
    db: AsyncSession, email: str, background: BackgroundTasks
) -> None:
    user = await get_user_by_email(db, email)
    if not user or not user.is_active:
        return

    raw, hashed = new_reset_token()
    db.add(
        PasswordResetToken(
            user_id=user.id,
            token_hash=hashed,
            expires_at=utcnow() + timedelta(minutes=settings.password_reset_expire_minutes),
        )
    )
    await db.commit()

    link = f"{settings.frontend_url}/resetPassword?token={raw}"
    background.add_task(
        mail.send_password_reset,
        user.email,
        user.name,
        link,
        settings.password_reset_expire_minutes,
    )


async def reset_password(db: AsyncSession, token: str, new_password: str) -> None:
    now = utcnow()
    record = (
        await db.execute(
            select(PasswordResetToken)
            .where(PasswordResetToken.token_hash == hash_token(token))
            .with_for_update()
        )
    ).scalar_one_or_none()

    if record is None or record.used_at is not None or record.expires_at <= now:
        raise BadRequest(INVALID_RESET)

    user = await db.get(User, record.user_id)
    if user is None:
        raise BadRequest(INVALID_RESET)

    user.password_hash = hash_password(new_password)
    await db.execute(
        update(PasswordResetToken)
        .where(PasswordResetToken.user_id == user.id, PasswordResetToken.used_at.is_(None))
        .values(used_at=now)
    )
    await db.commit()
