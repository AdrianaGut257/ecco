from fastapi import APIRouter

from src.core.deps import CurrentUser, DbSession
from src.modules.users import service
from src.modules.users.schemas import ProfileUpdate, UserOut, to_user_out

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut)
async def get_me(user: CurrentUser):
    return to_user_out(user)


@router.put("/me", response_model=UserOut)
async def update_me(data: ProfileUpdate, user: CurrentUser, db: DbSession):
    updated = await service.update_profile(db, user, data)
    return to_user_out(updated)
