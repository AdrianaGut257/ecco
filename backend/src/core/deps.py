from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.errors import Unauthorized
from src.core.security import decode_access_token
from src.database.postgres.database import get_db
from src.modules.users.models import User

_bearer = HTTPBearer(auto_error=False)

DbSession = Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    db: DbSession,
) -> User:
    if credentials is None:
        raise Unauthorized()
    user_id = decode_access_token(credentials.credentials)
    if user_id is None:
        raise Unauthorized()
    user = await db.get(User, user_id)
    if user is None or not user.is_active:
        raise Unauthorized()
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
