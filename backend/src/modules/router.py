from fastapi import APIRouter

from src.modules.auth.router import router as auth_router
from src.modules.chat.router import router as chat_router
from src.modules.garden.router import router as garden_router
from src.modules.health.router import router as health_router
from src.modules.matches.router import router as matches_router
from src.modules.moods.router import router as moods_router
from src.modules.suggestions.router import router as suggestions_router
from src.modules.users.router import router as users_router

router = APIRouter()

router.include_router(health_router)
router.include_router(auth_router)
router.include_router(users_router)
router.include_router(moods_router)
router.include_router(matches_router)
router.include_router(chat_router)
router.include_router(garden_router)
router.include_router(suggestions_router)
