import uuid
from datetime import timedelta

from sqlalchemy import update

from src.core.time import utcnow
from src.modules.matches.models import Match, MatchRequest


async def search(client, user, hobbies):
    return await client.post("/matches", json={"hobbies": hobbies}, headers=user["headers"])


async def travel(db, match_id, days):
    await db.execute(
        update(Match).where(Match.id == match_id).values(started_at=utcnow() - timedelta(days=days))
    )
    await db.commit()


async def paired(client, make_user):
    ana = await make_user("Ana", "ana@ejemplo.com", ["Películas", "Series", "Pop"])
    luis = await make_user("Luis", "luis@ejemplo.com", ["Películas", "Rock", "Jazz"])
    first = await search(client, ana, ["Pop", "Series"])
    assert first.json()["status"] == "searching"
    second = await search(client, luis, ["Películas"])
    assert second.json()["status"] == "matched"
    return ana, luis, second.json()["match"]


async def test_first_user_waits_second_user_gets_matched(client, make_user):
    ana, luis, match = await paired(client, make_user)
    assert match["partner"]["username"] == ana["user"]["username"]
    assert match["day"] == 1
    assert match["commonInterests"] == [{"category": "Entretenimiento", "items": ["Películas"]}]

    state = await client.get("/matches/search", headers=ana["headers"])
    assert state.json()["status"] == "matched"
    assert state.json()["match"]["partner"]["username"] == luis["user"]["username"]


async def test_search_validates_hobbies(client, make_user):
    ana = await make_user("Ana")
    assert (await search(client, ana, [])).status_code == 422
    assert (await search(client, ana, ["Películas", "Series", "Pop", "Rock"])).status_code == 422
    outside = await search(client, ana, ["Surf"])
    assert outside.status_code == 400
    assert "tus intereses" in outside.json()["detail"]


async def test_search_can_be_cancelled_and_repeated_safely(client, make_user):
    ana = await make_user("Ana")
    await search(client, ana, ["Películas"])
    again = await search(client, ana, ["Películas"])
    assert again.json()["status"] == "searching"
    cancel = await client.delete("/matches/search", headers=ana["headers"])
    assert cancel.status_code == 204
    idle = await client.get("/matches/search", headers=ana["headers"])
    assert idle.json()["status"] == "idle"


async def test_prefers_the_candidate_with_more_in_common(client, make_user, db):
    ana = await make_user("Ana", "ana@ejemplo.com", ["Películas", "Series", "Pop"])
    luis = await make_user("Luis", "luis@ejemplo.com", ["Rock", "Jazz", "Café"])
    eva = await make_user("Eva", "eva@ejemplo.com", ["Películas", "Series", "Pop"])
    for person, hobbies in ((luis, ["Rock"]), (eva, ["Películas"])):
        db.add(MatchRequest(user_id=uuid.UUID(person["user"]["id"]), hobbies=hobbies))
    await db.commit()

    res = await search(client, ana, ["Películas"])
    assert res.json()["match"]["partner"]["username"] == eva["user"]["username"]


async def test_cannot_search_while_in_a_conversation(client, make_user):
    ana, _, _ = await paired(client, make_user)
    res = await search(client, ana, ["Pop"])
    assert res.status_code == 409


async def test_users_who_already_met_are_not_paired_again(client, make_user, db):
    ana, luis, match = await paired(client, make_user)
    await travel(db, match["id"], 20)
    await search(client, ana, ["Películas"])
    res = await search(client, luis, ["Películas"])
    assert res.json()["status"] == "searching"


async def test_current_match_is_none_without_a_conversation(client, make_user):
    ana = await make_user("Ana")
    res = await client.get("/matches/current", headers=ana["headers"])
    assert res.status_code == 200
    assert res.json() is None


async def test_chat_between_partners_only(client, make_user):
    ana, luis, match = await paired(client, make_user)
    mid = match["id"]
    sent = await client.post(f"/matches/{mid}/messages", json={"text": "  ¡Hola!  "}, headers=luis["headers"])
    assert sent.status_code == 201
    assert sent.json()["text"] == "¡Hola!"
    assert sent.json()["fromMe"] is True

    seen = await client.get(f"/matches/{mid}/messages", headers=ana["headers"])
    assert [m["fromMe"] for m in seen.json()] == [False]

    outsider = await make_user("Eva", "eva@ejemplo.com")
    assert (await client.get(f"/matches/{mid}/messages", headers=outsider["headers"])).status_code == 404
    assert (
        await client.post(f"/matches/{mid}/messages", json={"text": "hola"}, headers=outsider["headers"])
    ).status_code == 404


async def test_chat_validates_text(client, make_user):
    ana, _, match = await paired(client, make_user)
    url = f"/matches/{match['id']}/messages"
    assert (await client.post(url, json={"text": "   "}, headers=ana["headers"])).status_code == 422
    assert (await client.post(url, json={"text": "a" * 501}, headers=ana["headers"])).status_code == 422


async def test_chat_closes_after_day_seven(client, make_user, db):
    ana, _, match = await paired(client, make_user)
    await travel(db, match["id"], 7)
    res = await client.post(
        f"/matches/{match['id']}/messages", json={"text": "hola"}, headers=ana["headers"]
    )
    assert res.status_code == 409
    assert "terminaron" in res.json()["detail"]


async def test_decision_only_from_day_seven(client, make_user, db):
    ana, luis, match = await paired(client, make_user)
    url = f"/matches/{match['id']}/decision"
    early = await client.post(url, json={"decision": "continue"}, headers=ana["headers"])
    assert early.status_code == 409
    assert "Faltan 6 días" in early.json()["detail"]

    await travel(db, match["id"], 6)
    ok = await client.post(url, json={"decision": "continue"}, headers=ana["headers"])
    assert ok.status_code == 200
    assert ok.json()["status"] == "waiting"
    twice = await client.post(url, json={"decision": "leave"}, headers=ana["headers"])
    assert twice.status_code == 409

    assert (await client.get("/matches/current", headers=ana["headers"])).json() is None
    still = await client.get("/matches/current", headers=luis["headers"])
    assert still.json()["id"] == match["id"]
    assert still.json()["status"] == "deciding"


async def say(client, user, match_id, text="hola"):
    return await client.post(f"/matches/{match_id}/messages", json={"text": text}, headers=user["headers"])


async def test_plant_grows_only_on_days_both_people_write(client, make_user, db):
    ana, luis, match = await paired(client, make_user)
    mid = match["id"]
    await say(client, ana, mid)
    garden = await client.get("/garden", headers=ana["headers"])
    assert garden.json()[0]["stage"] == 0

    await say(client, luis, mid)
    garden = await client.get("/garden", headers=ana["headers"])
    entry = garden.json()[0]
    assert entry["stage"] == 1
    assert entry["status"] == "active"
    assert entry["partnerAvatar"]["hair"] == "long"


async def test_daily_message_limit(client, make_user):
    ana, _, match = await paired(client, make_user)
    for i in range(5):
        assert (await say(client, ana, match["id"], f"mensaje {i}")).status_code == 201
    current = await client.get(f"/matches/{match['id']}", headers=ana["headers"])
    assert current.json()["messagesLeft"] == 0
    assert current.json()["canWrite"] is False
    extra = await say(client, ana, match["id"])
    assert extra.status_code == 409
    assert "Mañana" in extra.json()["detail"]


async def test_both_continue_blooms_and_keeps_chat_open(client, make_user, db):
    ana, luis, match = await paired(client, make_user)
    mid = match["id"]
    await travel(db, mid, 6)
    await client.post(f"/matches/{mid}/decision", json={"decision": "continue"}, headers=ana["headers"])
    res = await client.post(f"/matches/{mid}/decision", json={"decision": "continue"}, headers=luis["headers"])
    assert res.json()["status"] == "bloomed"
    assert res.json()["stage"] == 5

    await travel(db, mid, 12)
    assert (await say(client, ana, mid, "¡Seguimos!")).status_code == 201
    garden = await client.get("/garden", headers=luis["headers"])
    assert garden.json()[0]["status"] == "bloomed"


async def test_a_leave_is_not_revealed_while_the_other_waits(client, make_user, db):
    ana, luis, match = await paired(client, make_user)
    mid = match["id"]
    await travel(db, mid, 6)
    await client.post(f"/matches/{mid}/decision", json={"decision": "leave"}, headers=luis["headers"])
    mine = await client.post(f"/matches/{mid}/decision", json={"decision": "continue"}, headers=ana["headers"])
    assert mine.json()["status"] == "waiting"

    await travel(db, mid, 11)
    garden = await client.get("/garden", headers=ana["headers"])
    assert garden.json()[0]["status"] == "rested"


async def test_ending_a_conversation_closes_it_for_both(client, make_user, db):
    from sqlalchemy import select

    from src.modules.matches.models import Report

    ana, luis, match = await paired(client, make_user)
    mid = match["id"]
    bad = await client.post(f"/matches/{mid}/end", json={"reason": "furia"}, headers=ana["headers"])
    assert bad.status_code == 422

    res = await client.post(
        f"/matches/{mid}/end", json={"reason": "acoso", "note": "me incomodó"}, headers=ana["headers"]
    )
    assert res.status_code == 204
    report = (await db.execute(select(Report))).scalar_one()
    assert str(report.reported_id) == luis["user"]["id"]

    assert (await client.get("/matches/current", headers=luis["headers"])).json() is None
    blocked = await say(client, luis, mid)
    assert blocked.status_code == 409
    assert (await client.get("/garden", headers=ana["headers"])).json() == []
    assert (await client.get("/garden", headers=luis["headers"])).json()[0]["status"] == "closed"

    await search(client, ana, ["Películas"])
    again = await search(client, luis, ["Películas"])
    assert again.json()["status"] == "searching"


async def test_partner_sees_mood_only_when_shared(client, make_user):
    ana, luis, match = await paired(client, make_user)
    await client.post("/moods", json={"mood": "bien"}, headers=ana["headers"])
    seen = await client.get("/matches/current", headers=luis["headers"])
    assert seen.json()["partner"]["mood"] == "bien"

    await client.put("/users/me", json={"shareMood": False}, headers=ana["headers"])
    hidden = await client.get("/matches/current", headers=luis["headers"])
    assert hidden.json()["partner"]["mood"] is None


async def test_search_state_returns_hobbies_while_waiting(client, make_user):
    ana = await make_user("Ana")
    await search(client, ana, ["Series", "Pop"])
    state = await client.get("/matches/search", headers=ana["headers"])
    assert state.json() == {"status": "searching", "match": None, "hobbies": ["Series", "Pop"]}


async def test_simultaneous_searches_end_up_paired(client, make_user, db):
    import asyncio

    from sqlalchemy import func, select

    ana = await make_user("Ana", "ana@ejemplo.com")
    luis = await make_user("Luis", "luis@ejemplo.com")
    await asyncio.gather(search(client, ana, ["Pop"]), search(client, luis, ["Pop"]))

    states = [
        (await client.get("/matches/search", headers=u["headers"])).json() for u in (ana, luis)
    ]
    assert [s["status"] for s in states] == ["matched", "matched"]
    total = (await db.execute(select(func.count()).select_from(Match))).scalar()
    assert total == 1


async def test_messages_keep_their_tone(client, make_user):
    ana, luis, match = await paired(client, make_user)
    url = f"/matches/{match['id']}/messages"
    sent = await client.post(url, json={"text": "jaja", "tone": "joke"}, headers=ana["headers"])
    assert sent.json()["tone"] == "joke"
    plain = await say(client, ana, match["id"])
    assert plain.json()["tone"] is None
    assert (await client.post(url, json={"text": "hola", "tone": "angry"}, headers=ana["headers"])).status_code == 422
    seen = await client.get(url, headers=luis["headers"])
    assert [m["tone"] for m in seen.json()] == ["joke", None]


async def test_only_the_partner_can_react(client, make_user):
    ana, luis, match = await paired(client, make_user)
    mid = match["id"]
    msg = (await say(client, ana, mid, "me fue mal hoy")).json()
    url = f"/matches/{mid}/messages/{msg['id']}/reaction"

    assert (await client.put(url, json={"reaction": "mal"}, headers=ana["headers"])).status_code == 400
    assert (await client.put(url, json={"reaction": "enojo"}, headers=luis["headers"])).status_code == 422
    outsider = await make_user("Eva", "eva@ejemplo.com")
    assert (await client.put(url, json={"reaction": "mal"}, headers=outsider["headers"])).status_code == 404

    res = await client.put(url, json={"reaction": "mal"}, headers=luis["headers"])
    assert res.status_code == 200
    assert res.json()["reaction"] == "mal"
    assert res.json()["fromMe"] is False

    left = (await client.get(f"/matches/{mid}", headers=luis["headers"])).json()["messagesLeft"]
    assert left == 5


async def test_polling_returns_messages_whose_reaction_changed(client, make_user):
    ana, luis, match = await paired(client, make_user)
    mid = match["id"]
    msg = (await say(client, ana, mid)).json()
    url = f"/matches/{mid}/messages"

    nothing = await client.get(url, params={"after": msg["createdAt"]}, headers=ana["headers"])
    assert nothing.json() == []

    await client.put(f"{url}/{msg['id']}/reaction", json={"reaction": "feliz"}, headers=luis["headers"])
    changed = (await client.get(url, params={"after": msg["createdAt"]}, headers=ana["headers"])).json()
    assert [(m["id"], m["reaction"]) for m in changed] == [(msg["id"], "feliz")]

    await client.put(f"{url}/{msg['id']}/reaction", json={"reaction": None}, headers=luis["headers"])
    removed = (await client.get(url, params={"after": changed[0]["reactedAt"]}, headers=ana["headers"])).json()
    assert removed[0]["reaction"] is None
