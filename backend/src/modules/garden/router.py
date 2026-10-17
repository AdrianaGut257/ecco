from fastapi import APIRouter

from src.core.deps import CurrentUser, DbSession
from src.core.time import utcnow
from src.modules.garden.schemas import GardenEntryOut
from src.modules.matches import service
from src.modules.users.avatar import avatar_from

router = APIRouter(prefix="/garden", tags=["Garden"])


@router.get("", response_model=list[GardenEntryOut])
async def my_garden(user: CurrentUser, db: DbSession):
    matches = await service.list_matches(db, user.id)
    recip = await service.reciprocal_days(db, [m.id for m in matches])
    now = utcnow()
    entries = []
    for m in matches:
        partner = service.partner_of(m, user.id)
        status = service.status_for(m, user.id, now)
        entries.append(
            GardenEntryOut(
                id=str(m.id),
                partner_name=partner.username,
                partner_avatar=avatar_from(partner.avatar),
                stage=service.stage_for(status, recip[m.id]),
                status=status,
                started_at=m.started_at,
            )
        )
    return entries
