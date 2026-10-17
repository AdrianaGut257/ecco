from uuid import UUID

from fastapi import APIRouter, Response, status

from src.core.deps import CurrentUser, DbSession
from src.core.time import utcnow
from src.modules.matches import service
from src.modules.matches.schemas import DecisionIn, EndIn, MatchOut, SearchIn, SearchOut

router = APIRouter(prefix="/matches", tags=["Matches"])


@router.get("/current", response_model=MatchOut | None)
async def current_match(user: CurrentUser, db: DbSession):
    now = utcnow()
    match = await service.get_current_match(db, user.id, now)
    return await service.to_match_out(db, match, user.id, now) if match else None


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


@router.get("/{match_id}", response_model=MatchOut)
async def get_match(match_id: UUID, user: CurrentUser, db: DbSession):
    match = await service.get_participant_match(db, user.id, match_id)
    return await service.to_match_out(db, match, user.id, utcnow())


@router.post("/{match_id}/decision", response_model=MatchOut)
async def decide(match_id: UUID, data: DecisionIn, user: CurrentUser, db: DbSession):
    return await service.submit_decision(db, user, match_id, data.decision)


@router.post("/{match_id}/end", status_code=status.HTTP_204_NO_CONTENT)
async def end(match_id: UUID, data: EndIn, user: CurrentUser, db: DbSession):
    await service.end_match(db, user, match_id, data.reason, data.note)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
