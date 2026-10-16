from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Query
from sqlalchemy import select

from src.core.deps import CurrentUser, DbSession
from src.core.errors import Conflict
from src.core.time import utcnow
from src.modules.chat.models import Message
from src.modules.chat.schemas import MessageIn, MessageOut
from src.modules.matches import service
from src.modules.matches.constants import MATCH_DAYS
from src.modules.matches.models import MatchDecision

router = APIRouter(prefix="/matches", tags=["Chat"])

PAGE_SIZE = 200


def _out(message: Message, user_id: UUID) -> MessageOut:
    return MessageOut(
        id=str(message.id),
        match_id=str(message.match_id),
        text=message.text,
        from_me=message.sender_id == user_id,
        day=message.day,
        created_at=message.created_at,
    )


@router.get("/{match_id}/messages", response_model=list[MessageOut])
async def list_messages(
    match_id: UUID,
    user: CurrentUser,
    db: DbSession,
    after: datetime | None = Query(default=None),
):
    await service.get_participant_match(db, user.id, match_id)
    stmt = select(Message).where(Message.match_id == match_id)
    if after is not None:
        stmt = stmt.where(Message.created_at > after)
    stmt = stmt.order_by(Message.created_at).limit(PAGE_SIZE)
    messages = (await db.execute(stmt)).scalars().all()
    return [_out(m, user.id) for m in messages]


@router.post("/{match_id}/messages", response_model=MessageOut, status_code=201)
async def send_message(match_id: UUID, data: MessageIn, user: CurrentUser, db: DbSession):
    match = await service.get_participant_match(db, user.id, match_id)
    day = service.current_day(match, utcnow())

    if day > MATCH_DAYS:
        raise Conflict("Esta conversación ya terminó. ¡Gracias por compartir!")

    decided = await db.execute(
        select(MatchDecision.id).where(
            MatchDecision.match_id == match_id, MatchDecision.user_id == user.id
        )
    )
    if decided.first() is not None:
        raise Conflict("Ya enviaste tu respuesta final, así que esta conversación se cerró.")

    message = Message(match_id=match_id, sender_id=user.id, text=data.text, day=day)
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return _out(message, user.id)
