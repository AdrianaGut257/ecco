from fastapi import APIRouter, BackgroundTasks, Request, Response, status

from src.core.deps import DbSession
from src.core.rate_limit import login_limiter, reset_limiter
from src.modules.auth import service
from src.modules.auth.schemas import (
    AuthOut,
    ForgotPasswordIn,
    LoginIn,
    RegisterIn,
    ResetPasswordIn,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


def _client(request: Request) -> str:
    return request.client.host if request.client else "unknown"


@router.post("/register", response_model=AuthOut, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterIn, db: DbSession):
    return await service.register(db, data)


@router.post("/login", response_model=AuthOut)
async def login(data: LoginIn, request: Request, db: DbSession):
    login_limiter.check(f"{_client(request)}:{data.email}")
    return await service.login(db, data)


@router.post("/forgot-password", status_code=status.HTTP_204_NO_CONTENT)
async def forgot_password(
    data: ForgotPasswordIn, request: Request, background: BackgroundTasks, db: DbSession
):
    reset_limiter.check(f"{_client(request)}:{data.email}")
    await service.request_password_reset(db, data.email, background)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/reset-password", status_code=status.HTTP_204_NO_CONTENT)
async def reset_password(data: ResetPasswordIn, db: DbSession):
    await service.reset_password(db, data.token, data.password)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
