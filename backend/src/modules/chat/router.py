from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Query
from sqlalchemy import select

from src.core.deps import CurrentUser, DbSession
from src.core.errors import BadRequest, Conflict
from src.core.moderation import BLOCKED_MESSAGE, GENTLE_MESSAGE, classify
from src.core.time import utcnow
from src.modules.chat.models import Message
from src.modules.chat.schemas import MessageIn, MessageOut
from src.modules.matches import service
from src.modules.matches.constants import MATCH_DAYS, MESSAGES_PER_DAY

router = APIRouter(prefix="/matches", tags=["Chat"])

PAGE_SIZE = 200

CLOSED_REASONS = {
    "closed": "Esta conversación se cerró. Gracias por el tiempo que compartiste.",
    "waiting": "Ya enviaste tu respuesta final, así que esta conversación se cerró.",
    "rested": "Esta conversación ya terminó. ¡Gracias por compartir!",
}


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
    now = utcnow()
    day = service.current_day(match, now)
    status = service.status_for(match, user.id, now)

    if status in CLOSED_REASONS:
        raise Conflict(CLOSED_REASONS[status])
    if status != "bloomed" and day > MATCH_DAYS:
        raise Conflict("Los 7 días de conversación terminaron. Es momento de decidir.")
    if await service.sent_on_day(db, match.id, user.id, day) >= MESSAGES_PER_DAY:
        raise Conflict("Ya compartiste tus mensajes de hoy. Mañana podrás escribir de nuevo.")

    level = classify(data.text)
    if level == "severe":
        raise BadRequest(BLOCKED_MESSAGE, code="blocked")
    if level == "mild" and not data.confirmed:
        raise Conflict(GENTLE_MESSAGE, code="gentle_check")

    message = Message(match_id=match_id, sender_id=user.id, text=data.text, day=day)
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return _out(message, user.id)
