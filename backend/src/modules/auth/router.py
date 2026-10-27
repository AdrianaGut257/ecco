from fastapi import APIRouter, BackgroundTasks, Request, Response, status

from src.core.deps import CurrentUser, DbSession
from src.core.rate_limit import code_limiter, login_limiter, reset_limiter
from src.modules.auth import service
from src.modules.auth.schemas import (
    AuthOut,
    ForgotPasswordIn,
    LoginIn,
    RegisterIn,
    ResetPasswordIn,
    VerifyEmailIn,
)
from src.modules.users.schemas import UserOut

router = APIRouter(prefix="/auth", tags=["Auth"])


def _client(request: Request) -> str:
    return request.client.host if request.client else "unknown"


@router.post("/register", response_model=AuthOut, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterIn, background: BackgroundTasks, db: DbSession):
    return await service.register(db, data, background)


@router.post("/login", response_model=AuthOut)
async def login(data: LoginIn, request: Request, db: DbSession):
    login_limiter.check(f"{_client(request)}:{data.email}")
    return await service.login(db, data)


@router.post("/verify-email", response_model=UserOut)
async def verify_email(data: VerifyEmailIn, request: Request, user: CurrentUser, db: DbSession):
    code_limiter.check(f"{_client(request)}:verify:{user.id}")
    return await service.verify_email(db, user, data.code)


@router.post("/resend-verification", status_code=status.HTTP_204_NO_CONTENT)
async def resend_verification(user: CurrentUser, background: BackgroundTasks, db: DbSession):
    reset_limiter.check(f"verify:{user.id}")
    await service.resend_verification(db, user, background)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/forgot-password", status_code=status.HTTP_204_NO_CONTENT)
async def forgot_password(
    data: ForgotPasswordIn, request: Request, background: BackgroundTasks, db: DbSession
):
    reset_limiter.check(f"{_client(request)}:{data.email}")
    await service.request_password_reset(db, data.email, background)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/reset-password", status_code=status.HTTP_204_NO_CONTENT)
async def reset_password(data: ResetPasswordIn, request: Request, db: DbSession):
    code_limiter.check(f"{_client(request)}:reset:{data.email}")
    await service.reset_password(db, data.email, data.code, data.password)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
