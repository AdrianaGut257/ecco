import uuid
from collections import Counter
from datetime import datetime, timedelta

from sqlalchemy import case, func, or_, select, text, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.errors import BadRequest, Conflict, NotFound
from src.core.time import utcnow
from src.modules.chat.models import Message
from src.modules.matches.constants import (
    DECISION_GRACE_DAYS,
    MATCH_DAYS,
    MESSAGES_PER_DAY,
    MOOD_VISIBLE_HOURS,
    PLANT_STAGES,
    SEARCH_TTL_HOURS,
)
from src.modules.matches.models import Match, MatchDecision, MatchRequest, Report
from src.modules.matches.schemas import (
    CommonInterestOut,
    MatchOut,
    MatchStatus,
    PartnerOut,
    SearchOut,
)
from src.modules.moods.models import MoodEntry
from src.modules.users.avatar import avatar_from
from src.modules.users.catalog import CATEGORY_BY_INTEREST, OTHER_CATEGORY
from src.modules.users.models import User


MATCHMAKING_LOCK_KEY = 727301
WRITABLE: set[MatchStatus] = {"active", "deciding", "bloomed"}


async def _lock_matchmaking(db: AsyncSession) -> None:
    await db.execute(text("SELECT pg_advisory_xact_lock(:key)"), {"key": MATCHMAKING_LOCK_KEY})


def current_day(match: Match, now: datetime) -> int:
    return max((now - match.started_at).days + 1, 1)


def partner_of(match: Match, user_id: uuid.UUID) -> User:
    return match.user_b if match.user_a_id == user_id else match.user_a


def me_of(match: Match, user_id: uuid.UUID) -> User:
    return match.user_a if match.user_a_id == user_id else match.user_b


def decisions_of(match: Match, user_id: uuid.UUID) -> tuple[str | None, str | None]:
    mine = theirs = None
    for decision in match.decisions:
        if decision.user_id == user_id:
            mine = decision.decision
        else:
            theirs = decision.decision
    return mine, theirs


def status_for(match: Match, user_id: uuid.UUID, now: datetime) -> MatchStatus:
    if match.ended_at is not None:
        return "closed"
    mine, theirs = decisions_of(match, user_id)
    if mine == "continue" and theirs == "continue":
        return "bloomed"
    if mine == "leave":
        return "rested"
    if current_day(match, now) > MATCH_DAYS + DECISION_GRACE_DAYS:
        return "rested"
    if mine == "continue":
        return "waiting"
    if current_day(match, now) >= MATCH_DAYS:
        return "deciding"
    return "active"


def stage_for(status: MatchStatus, reciprocal_days: int) -> int:
    if status == "bloomed":
        return PLANT_STAGES - 1
    return min(reciprocal_days, PLANT_STAGES - 1)


def common_interests(a: User, b: User) -> list[CommonInterestOut]:
    shared = sorted({i.name for i in a.interests} & {i.name for i in b.interests})
    groups: dict[str, list[str]] = {}
    for name in shared:
        groups.setdefault(CATEGORY_BY_INTEREST.get(name, OTHER_CATEGORY), []).append(name)
    return [CommonInterestOut(category=c, items=items) for c, items in groups.items()]


async def reciprocal_days(db: AsyncSession, match_ids: list[uuid.UUID]) -> Counter:
    if not match_ids:
        return Counter()
    stmt = (
        select(Message.match_id)
        .where(Message.match_id.in_(match_ids))
        .group_by(Message.match_id, Message.day)
        .having(func.count(func.distinct(Message.sender_id)) >= 2)
    )
    return Counter((await db.execute(stmt)).scalars().all())


async def sent_on_day(db: AsyncSession, match_id: uuid.UUID, user_id: uuid.UUID, day: int) -> int:
    stmt = select(func.count()).where(
        Message.match_id == match_id, Message.sender_id == user_id, Message.day == day
    )
    return (await db.execute(stmt)).scalar_one()


async def visible_mood(db: AsyncSession, user: User, now: datetime) -> str | None:
    if not user.share_mood:
        return None
    stmt = (
        select(MoodEntry.mood)
        .where(
            MoodEntry.user_id == user.id,
            MoodEntry.created_at > now - timedelta(hours=MOOD_VISIBLE_HOURS),
        )
        .order_by(MoodEntry.created_at.desc())
        .limit(1)
    )
    return (await db.execute(stmt)).scalar_one_or_none()


async def to_match_out(db: AsyncSession, match: Match, user_id: uuid.UUID, now: datetime) -> MatchOut:
    partner = partner_of(match, user_id)
    status = status_for(match, user_id, now)
    day = current_day(match, now)
    recip = (await reciprocal_days(db, [match.id]))[match.id]

    open_today = status == "bloomed" or (status in WRITABLE and day <= MATCH_DAYS)
    left = 0
    if open_today:
        left = max(MESSAGES_PER_DAY - await sent_on_day(db, match.id, user_id, day), 0)

    return MatchOut(
        id=str(match.id),
        partner=PartnerOut(
            username=partner.username,
            avatar=avatar_from(partner.avatar),
            mood=await visible_mood(db, partner, now),
        ),
        common_interests=common_interests(me_of(match, user_id), partner),
        hobbies=list(match.hobbies or []),
        started_at=match.started_at,
        day=day,
        stage=stage_for(status, recip),
        status=status,
        can_write=open_today and left > 0,
        messages_left=left,
    )


async def get_current_match(db: AsyncSession, user_id: uuid.UUID, now: datetime) -> Match | None:
    cutoff = now - timedelta(days=MATCH_DAYS + DECISION_GRACE_DAYS)
    decided = select(MatchDecision.match_id).where(MatchDecision.user_id == user_id)
    stmt = (
        select(Match)
        .where(
            or_(Match.user_a_id == user_id, Match.user_b_id == user_id),
            Match.started_at > cutoff,
            Match.ended_at.is_(None),
            Match.id.not_in(decided),
        )
        .order_by(Match.started_at.desc())
        .limit(1)
    )
    return (await db.execute(stmt)).scalar_one_or_none()


async def get_participant_match(db: AsyncSession, user_id: uuid.UUID, match_id: uuid.UUID) -> Match:
    stmt = select(Match).where(
        Match.id == match_id,
        or_(Match.user_a_id == user_id, Match.user_b_id == user_id),
    )
    match = (await db.execute(stmt)).scalar_one_or_none()
    if match is None:
        raise NotFound("No encontramos esa conversación.")
    return match


async def list_matches(db: AsyncSession, user_id: uuid.UUID) -> list[Match]:
    stmt = (
        select(Match)
        .where(
            or_(Match.user_a_id == user_id, Match.user_b_id == user_id),
            or_(Match.ended_by_id.is_(None), Match.ended_by_id != user_id),
        )
        .order_by(Match.started_at.desc())
    )
    return list((await db.execute(stmt)).scalars().all())


async def _expire_stale(db: AsyncSession, user_id: uuid.UUID, now: datetime) -> None:
    cutoff = now - timedelta(hours=SEARCH_TTL_HOURS)
    await db.execute(
        update(MatchRequest)
        .where(
            MatchRequest.user_id == user_id,
            MatchRequest.status == "searching",
            MatchRequest.created_at <= cutoff,
        )
        .values(status="expired")
    )


async def _searching_request(db: AsyncSession, user_id: uuid.UUID) -> MatchRequest | None:
    stmt = select(MatchRequest).where(
        MatchRequest.user_id == user_id, MatchRequest.status == "searching"
    )
    return (await db.execute(stmt)).scalar_one_or_none()


async def _try_pair(
    db: AsyncSession, user: User, request: MatchRequest, now: datetime
) -> Match | None:
    cutoff = now - timedelta(hours=SEARCH_TTL_HOURS)
    met = select(
        case((Match.user_a_id == user.id, Match.user_b_id), else_=Match.user_a_id)
    ).where(or_(Match.user_a_id == user.id, Match.user_b_id == user.id))

    stmt = (
        select(MatchRequest)
        .where(
            MatchRequest.status == "searching",
            MatchRequest.user_id != user.id,
            MatchRequest.created_at > cutoff,
            MatchRequest.user_id.not_in(met),
        )
        .order_by(MatchRequest.created_at)
        .limit(25)
    )
    candidates = (await db.execute(stmt)).scalars().all()
    if not candidates:
        return None

    users = {
        u.id: u
        for u in (
            await db.execute(select(User).where(User.id.in_([c.user_id for c in candidates])))
        ).scalars()
    }
    mine = {i.name for i in user.interests}

    best: MatchRequest | None = None
    best_key: tuple[int, float] | None = None
    for candidate in candidates:
        candidate_user = users.get(candidate.user_id)
        if candidate_user is None or not candidate_user.is_active:
            continue
        shared_hobbies = set(request.hobbies) & set(candidate.hobbies)
        shared_interests = mine & {i.name for i in candidate_user.interests}
        key = (len(shared_hobbies) * 3 + len(shared_interests), -candidate.created_at.timestamp())
        if best_key is None or key > best_key:
            best, best_key = candidate, key

    if best is None:
        return None

    match = Match(
        user_a_id=best.user_id,
        user_b_id=user.id,
        hobbies=sorted(set(request.hobbies) & set(best.hobbies)),
        started_at=now,
    )
    db.add(match)
    await db.flush()
    best.status = "matched"
    best.match_id = match.id
    request.status = "matched"
    request.match_id = match.id
    return match


async def start_search(
    db: AsyncSession, user: User, hobbies: list[str]
) -> SearchOut:
    if not set(hobbies) <= {i.name for i in user.interests}:
        raise BadRequest("Elige temas que estén entre tus intereses.")

    await _lock_matchmaking(db)
    now = utcnow()
    if await get_current_match(db, user.id, now):
        raise Conflict("Ya tienes una conversación en curso. ¡Continúa con ella!")

    await _expire_stale(db, user.id, now)
    request = await _searching_request(db, user.id)

    if request is None:
        request = MatchRequest(user_id=user.id, hobbies=hobbies, status="searching")
        try:
            async with db.begin_nested():
                db.add(request)
                await db.flush()
        except IntegrityError:
            request = await _searching_request(db, user.id)
    if request is not None:
        request.hobbies = hobbies
        await _try_pair(db, user, request, now)
    await db.commit()
    return await search_state(db, user)


async def search_state(db: AsyncSession, user: User) -> SearchOut:
    await _lock_matchmaking(db)
    now = utcnow()
    await _expire_stale(db, user.id, now)
    request = await _searching_request(db, user.id)

    if request is not None:
        await _try_pair(db, user, request, now)
        await db.commit()
        if request.status == "searching":
            return SearchOut(status="searching", hobbies=list(request.hobbies))

    await db.commit()
    match = await get_current_match(db, user.id, now)
    if match is None:
        return SearchOut(status="idle")
    return SearchOut(status="matched", match=await to_match_out(db, match, user.id, now))


async def cancel_search(db: AsyncSession, user: User) -> None:
    await db.execute(
        update(MatchRequest)
        .where(MatchRequest.user_id == user.id, MatchRequest.status == "searching")
        .values(status="cancelled")
    )
    await db.commit()


async def submit_decision(
    db: AsyncSession, user: User, match_id: uuid.UUID, decision: str
) -> MatchOut:
    match = await get_participant_match(db, user.id, match_id)
    now = utcnow()
    day = current_day(match, now)

    if match.ended_at is not None:
        raise Conflict("Esta conversación ya se cerró.")
    if day < MATCH_DAYS:
        remaining = MATCH_DAYS - day
        suffix = "día" if remaining == 1 else "días"
        raise Conflict(f"Todavía no es momento de decidir. Faltan {remaining} {suffix}.")
    if day > MATCH_DAYS + DECISION_GRACE_DAYS:
        raise Conflict("El tiempo para decidir ya pasó, pero puedes empezar una nueva conexión.")

    db.add(MatchDecision(match_id=match.id, user_id=user.id, decision=decision))
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise Conflict("Ya enviaste tu respuesta. ¡Gracias!")

    await db.refresh(match, ["decisions"])
    return await to_match_out(db, match, user.id, now)


async def end_match(
    db: AsyncSession, user: User, match_id: uuid.UUID, reason: str | None, note: str | None
) -> None:
    match = await get_participant_match(db, user.id, match_id)
    if match.ended_at is not None:
        raise Conflict("Esta conversación ya se cerró.")

    match.ended_at = utcnow()
    match.ended_by_id = user.id
    if reason is not None:
        db.add(
            Report(
                match_id=match.id,
                reporter_id=user.id,
                reported_id=partner_of(match, user.id).id,
                reason=reason,
                note=note,
            )
        )
    await db.commit()
