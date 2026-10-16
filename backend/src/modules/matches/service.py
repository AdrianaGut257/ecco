import uuid
from datetime import datetime, timedelta

from sqlalchemy import case, or_, select, text, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.errors import Conflict, NotFound
from src.core.time import utcnow
from src.modules.matches.constants import (
    DECISION_GRACE_DAYS,
    MATCH_DAYS,
    PLANT_STAGES,
    SEARCH_TTL_HOURS,
)
from src.modules.matches.models import Match, MatchDecision, MatchRequest
from src.modules.matches.schemas import (
    CommonInterestOut,
    MatchOut,
    PartnerOut,
    SearchOut,
)
from src.modules.users.catalog import CATEGORY_BY_INTEREST, OTHER_CATEGORY
from src.modules.users.models import User


MATCHMAKING_LOCK_KEY = 727301


async def _lock_matchmaking(db: AsyncSession) -> None:
    await db.execute(text("SELECT pg_advisory_xact_lock(:key)"), {"key": MATCHMAKING_LOCK_KEY})


def current_day(match: Match, now: datetime) -> int:
    return max((now - match.started_at).days + 1, 1)


def stage_for_day(day: int) -> int:
    return min(max(day - 1, 0), PLANT_STAGES - 1)


def partner_of(match: Match, user_id: uuid.UUID) -> User:
    return match.user_b if match.user_a_id == user_id else match.user_a


def common_interests(a: User, b: User) -> list[CommonInterestOut]:
    shared = sorted({i.name for i in a.interests} & {i.name for i in b.interests})
    groups: dict[str, list[str]] = {}
    for name in shared:
        groups.setdefault(CATEGORY_BY_INTEREST.get(name, OTHER_CATEGORY), []).append(name)
    return [CommonInterestOut(category=c, items=items) for c, items in groups.items()]


def to_match_out(match: Match, user_id: uuid.UUID, now: datetime) -> MatchOut:
    partner = partner_of(match, user_id)
    me = match.user_a if match.user_a_id == user_id else match.user_b
    return MatchOut(
        id=str(match.id),
        partner=PartnerOut(username=partner.username, avatar_id=partner.avatar_id),
        common_interests=common_interests(me, partner),
        started_at=match.started_at,
        day=current_day(match, now),
    )


async def get_current_match(db: AsyncSession, user_id: uuid.UUID, now: datetime) -> Match | None:
    cutoff = now - timedelta(days=MATCH_DAYS + DECISION_GRACE_DAYS)
    decided = select(MatchDecision.match_id).where(MatchDecision.user_id == user_id)
    stmt = (
        select(Match)
        .where(
            or_(Match.user_a_id == user_id, Match.user_b_id == user_id),
            Match.started_at > cutoff,
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
            return SearchOut(status="searching")

    match = await get_current_match(db, user.id, now)
    if match is None:
        return SearchOut(status="idle")
    return SearchOut(status="matched", match=to_match_out(match, user.id, now))


async def cancel_search(db: AsyncSession, user: User) -> None:
    await db.execute(
        update(MatchRequest)
        .where(MatchRequest.user_id == user.id, MatchRequest.status == "searching")
        .values(status="cancelled")
    )
    await db.commit()


async def submit_decision(
    db: AsyncSession, user: User, match_id: uuid.UUID, decision: str
) -> None:
    match = await get_participant_match(db, user.id, match_id)
    now = utcnow()
    day = current_day(match, now)

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
