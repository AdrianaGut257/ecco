import random
import re

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.errors import Conflict
from src.core.time import utcnow
from src.modules.users.models import User, UserInterest
from src.modules.users.schemas import ProfileUpdate

USERNAME_TAKEN = "Ese nombre ya está en uso. ¿Probamos con otro?"


async def username_exists(db: AsyncSession, username: str, exclude_id=None) -> bool:
    stmt = select(User.id).where(func.lower(User.username) == username.lower())
    if exclude_id is not None:
        stmt = stmt.where(User.id != exclude_id)
    return (await db.execute(stmt)).first() is not None


async def generate_username(db: AsyncSession, name: str) -> str:
    base = re.sub(r"[^A-Za-z0-9]", "", name.split()[0] if name.split() else "")[:12] or "Amigo"
    for _ in range(10):
        candidate = f"{base}{random.randint(100, 9999)}"
        if not await username_exists(db, candidate):
            return candidate
    return f"{base}{random.randint(10000, 99999)}"


def _replace_interests(user: User, names: list[str]) -> None:
    existing = {interest.name: interest for interest in user.interests}
    for name, interest in existing.items():
        if name not in names:
            user.interests.remove(interest)
    for name in names:
        if name not in existing:
            user.interests.append(UserInterest(name=name))


def _apply_details(user: User, details: dict) -> None:
    for interest in user.interests:
        interest.details = details.get(interest.name) or None


async def update_profile(db: AsyncSession, user: User, data: ProfileUpdate) -> User:
    if data.username is not None and data.username.lower() != user.username.lower():
        if await username_exists(db, data.username, exclude_id=user.id):
            raise Conflict(USERNAME_TAKEN)
    if data.username is not None:
        user.username = data.username
    if data.avatar is not None:
        user.avatar = data.avatar.model_dump()
    if data.share_mood is not None:
        user.share_mood = data.share_mood
    if data.interests is not None:
        _replace_interests(user, data.interests)
    if data.interest_details is not None:
        _apply_details(user, data.interest_details)
    if data.terms_accepted and user.terms_accepted_at is None:
        user.terms_accepted_at = utcnow()

    try:
        await db.commit()
    except IntegrityError as error:
        await db.rollback()
        if "uq_users_username_lower" in str(error.orig):
            raise Conflict(USERNAME_TAKEN)
        raise

    await db.refresh(user)
    return user
