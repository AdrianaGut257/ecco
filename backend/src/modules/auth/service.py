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
    hash_email_code,
    hash_password,
    new_email_code,
    verify_password,
)
from src.core.time import utcnow
from src.modules.auth.models import EmailCode
from src.modules.auth.schemas import AuthOut, LoginIn, RegisterIn
from src.modules.users.models import User
from src.modules.users.schemas import UserOut, to_user_out
from src.modules.users.service import generate_username

EMAIL_TAKEN = "Ya existe una cuenta con ese correo. ¿Quieres iniciar sesión?"
BAD_CREDENTIALS = "El correo o la contraseña no coinciden. Prueba de nuevo."
CODE_EXPIRED = "El código venció o ya se usó. Pide uno nuevo."
CODE_WRONG = "El código no coincide. Revísalo e intenta de nuevo."
CODE_LOCKED = "Hubo demasiados intentos. Pide un código nuevo."
MAX_ATTEMPTS = 5

VERIFY = "verify"
RESET = "reset"


def _auth_out(user: User) -> AuthOut:
    return AuthOut(access_token=create_access_token(user.id), user=to_user_out(user))


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    return (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()


async def _issue_code(db: AsyncSession, user: User, purpose: str) -> str:
    """Crea un código nuevo y anula los anteriores del mismo tipo: solo vale el último que llegó."""
    now = utcnow()
    await db.execute(
        update(EmailCode)
        .where(EmailCode.user_id == user.id, EmailCode.purpose == purpose, EmailCode.used_at.is_(None))
        .values(used_at=now)
    )
    code = new_email_code()
    db.add(
        EmailCode(
            user_id=user.id,
            purpose=purpose,
            code_hash=hash_email_code(user.id, code),
            expires_at=now + timedelta(minutes=settings.email_code_expire_minutes),
        )
    )
    await db.commit()
    return code


async def _consume_code(db: AsyncSession, user: User, purpose: str, code: str) -> None:
    now = utcnow()
    record = (
        await db.execute(
            select(EmailCode)
            .where(EmailCode.user_id == user.id, EmailCode.purpose == purpose, EmailCode.used_at.is_(None))
            .order_by(EmailCode.created_at.desc())
            .limit(1)
            .with_for_update()
        )
    ).scalar_one_or_none()

    if record is None or record.expires_at <= now:
        raise BadRequest(CODE_EXPIRED)

    if record.code_hash != hash_email_code(user.id, code):
        record.attempts += 1
        locked = record.attempts >= MAX_ATTEMPTS
        if locked:
            record.used_at = now
        await db.commit()
        raise BadRequest(CODE_LOCKED if locked else CODE_WRONG)

    record.used_at = now


def _send_verification(background: BackgroundTasks, user: User, code: str) -> None:
    background.add_task(
        mail.send_verification_code, user.email, user.name, code, settings.email_code_expire_minutes
    )


async def register(db: AsyncSession, data: RegisterIn, background: BackgroundTasks) -> AuthOut:
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
    _send_verification(background, user, await _issue_code(db, user, VERIFY))
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


async def resend_verification(db: AsyncSession, user: User, background: BackgroundTasks) -> None:
    if user.email_verified_at is not None:
        return
    _send_verification(background, user, await _issue_code(db, user, VERIFY))


async def verify_email(db: AsyncSession, user: User, code: str) -> UserOut:
    if user.email_verified_at is None:
        await _consume_code(db, user, VERIFY, code)
        user.email_verified_at = utcnow()
        await db.commit()
        await db.refresh(user)
    return to_user_out(user)


async def request_password_reset(
    db: AsyncSession, email: str, background: BackgroundTasks
) -> None:
    user = await get_user_by_email(db, email)
    if not user or not user.is_active:
        return

    code = await _issue_code(db, user, RESET)
    background.add_task(
        mail.send_password_reset_code,
        user.email,
        user.name,
        code,
        settings.email_code_expire_minutes,
    )


async def reset_password(db: AsyncSession, email: str, code: str, new_password: str) -> None:
    user = await get_user_by_email(db, email)
    if user is None:
        raise BadRequest(CODE_EXPIRED)

    await _consume_code(db, user, RESET, code)
    user.password_hash = hash_password(new_password)
    # Quien recibió el código en su correo demostró que el correo es suyo.
    if user.email_verified_at is None:
        user.email_verified_at = utcnow()
    await db.commit()
