from fastapi import APIRouter, Response, status

from src.core.deps import CurrentUser, DbSession
from src.core.time import utcnow
from src.modules.matches import service
from src.modules.matches.schemas import DecisionIn, MatchOut, SearchIn, SearchOut
from uuid import UUID

router = APIRouter(prefix="/matches", tags=["Matches"])


@router.get("/current", response_model=MatchOut | None)
async def current_match(user: CurrentUser, db: DbSession):
    now = utcnow()
    match = await service.get_current_match(db, user.id, now)
    return service.to_match_out(match, user.id, now) if match else None


@router.post("", response_model=SearchOut)
async def start_search(data: SearchIn, user: CurrentUser, db: DbSession):
    return await service.start_search(db, user, data.hobbies)


@router.get("/search", response_model=SearchOut)
async def search_state(user: CurrentUser, db: DbSession):
    return await service.search_state(db, user)


@router.delete("/search", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_search(user: CurrentUser, db: DbSession):
    await service.cancel_search(db, user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{match_id}/decision", status_code=status.HTTP_204_NO_CONTENT)
async def decide(match_id: UUID, data: DecisionIn, user: CurrentUser, db: DbSession):
    await service.submit_decision(db, user, match_id, data.decision)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
