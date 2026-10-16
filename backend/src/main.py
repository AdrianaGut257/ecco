from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config.config import settings
from src.core.errors import register_error_handlers
from src.database.postgres import models  # noqa: F401
from src.modules.router import router


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
)


origins = [
    origin.strip()
    for origin in settings.cors_origins.split(",")
    if origin.strip()
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


register_error_handlers(app)

app.include_router(router, prefix="/api")
