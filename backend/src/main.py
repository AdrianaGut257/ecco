from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config.config import settings
from src.core.errors import register_error_handlers
from src.database.postgres import models  # noqa: F401
from src.modules.router import router
from src.modules.suggestions.service import close_client


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    await close_client()


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    lifespan=lifespan,
)


origins = [
    origin.strip()
    for origin in settings.cors_origins.split(",")
    if origin.strip()
]


# En desarrollo también se acepta la app web abierta desde 127.0.0.1 o desde la IP de la PC en la red local (otro teléfono).
LOCAL_NETWORK = r"http://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?"

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=LOCAL_NETWORK if settings.environment == "development" else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


register_error_handlers(app)

app.include_router(router, prefix="/api")
