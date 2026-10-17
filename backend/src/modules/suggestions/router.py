from fastapi import APIRouter, Query

from src.core.deps import CurrentUser
from src.core.rate_limit import RateLimiter
from src.modules.suggestions import service
from src.modules.suggestions.schemas import SuggestionOut

router = APIRouter(prefix="/suggestions", tags=["Suggestions"])

suggest_limiter = RateLimiter(limit=60, window_seconds=60)


@router.get("", response_model=list[SuggestionOut])
async def suggestions(
    user: CurrentUser,
    q: str = Query(min_length=2, max_length=60),
    interest: str = Query(min_length=1, max_length=60),
):
    suggest_limiter.check(str(user.id))
    return await service.suggest(q.strip(), interest.strip())
