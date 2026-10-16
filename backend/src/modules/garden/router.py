from fastapi import APIRouter
from sqlalchemy import or_, select

from src.core.deps import CurrentUser, DbSession
from src.core.time import utcnow
from src.modules.garden.schemas import GardenEntryOut
from src.modules.matches import service
from src.modules.matches.models import Match

router = APIRouter(prefix="/garden", tags=["Garden"])


@router.get("", response_model=list[GardenEntryOut])
async def my_garden(user: CurrentUser, db: DbSession):
    stmt = (
        select(Match)
        .where(or_(Match.user_a_id == user.id, Match.user_b_id == user.id))
        .order_by(Match.started_at.desc())
    )
    matches = (await db.execute(stmt)).scalars().all()
    now = utcnow()
    return [
        GardenEntryOut(
            id=str(m.id),
            partner_name=service.partner_of(m, user.id).username,
            stage=service.stage_for_day(service.current_day(m, now)),
            started_at=m.started_at,
        )
        for m in matches
    ]
