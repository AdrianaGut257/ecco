from fastapi import APIRouter

from src.modules.health.router import router as health_router


router = APIRouter()

router.include_router(health_router)