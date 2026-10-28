import uuid
from collections import Counter

from fastapi import APIRouter
from sqlalchemy import select

from src.core.deps import CurrentUser, DbSession
from src.core.errors import NotFound
from src.core.time import utcnow
from src.modules.chat.models import Message
from src.modules.garden.schemas import FirstMessageOut, GardenEntryOut, MemoryOut
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


@router.get("/{match_id}", response_model=MemoryOut)
async def memory(match_id: uuid.UUID, user: CurrentUser, db: DbSession):
    match = await service.get_participant_match(db, user.id, match_id)
    if match.ended_by_id == user.id:
        raise NotFound("No encontramos esa conversación.")
    now = utcnow()
    status = service.status_for(match, user.id, now)
    recip = await service.reciprocal_days(db, [match.id])
    me, partner = service.me_of(match, user.id), service.partner_of(match, user.id)
    messages = (
        await db.execute(
            select(Message).where(Message.match_id == match.id).order_by(Message.created_at)
        )
    ).scalars().all()
    reactions = Counter(m.reaction for m in messages if m.reaction)
    tones = Counter(m.tone for m in messages if m.tone)
    first = messages[0] if messages else None
    return MemoryOut(
        id=str(match.id),
        partner_name=partner.username,
        partner_avatar=avatar_from(partner.avatar),
        stage=service.stage_for(status, recip[match.id]),
        status=status,
        started_at=match.started_at,
        hobbies=list(match.hobbies or []),
        shared_favorites=service.shared_favorites(me, partner),
        common_interests=service.common_interests(me, partner),
        reactions=[r for r, _ in reactions.most_common()],
        tone=tones.most_common(1)[0][0] if tones else None,
        first_message=FirstMessageOut(text=first.text, from_me=first.sender_id == user.id)
        if first
        else None,
    )
