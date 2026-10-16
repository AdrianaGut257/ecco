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
    first = await search(client, ana, ["Música", "Viajes"])
    assert first.json()["status"] == "searching"
    second = await search(client, luis, ["Música"])
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
    assert (await search(client, ana, ["Viajes", "Música", "Juegos", "Comida"])).status_code == 422
    assert (await search(client, ana, ["Surf"])).status_code == 422


async def test_search_can_be_cancelled_and_repeated_safely(client, make_user):
    ana = await make_user("Ana")
    await search(client, ana, ["Viajes"])
    again = await search(client, ana, ["Viajes"])
    assert again.json()["status"] == "searching"
    cancel = await client.delete("/matches/search", headers=ana["headers"])
    assert cancel.status_code == 204
    idle = await client.get("/matches/search", headers=ana["headers"])
    assert idle.json()["status"] == "idle"


async def test_prefers_the_candidate_with_more_in_common(client, make_user, db):
    ana = await make_user("Ana", "ana@ejemplo.com", ["Películas", "Series", "Pop"])
    luis = await make_user("Luis", "luis@ejemplo.com", ["Rock", "Jazz", "Café"])
    eva = await make_user("Eva", "eva@ejemplo.com", ["Películas", "Series", "Pop"])
    for person, hobbies in ((luis, ["Juegos"]), (eva, ["Música"])):
        db.add(MatchRequest(user_id=uuid.UUID(person["user"]["id"]), hobbies=hobbies))
    await db.commit()

    res = await search(client, ana, ["Música"])
    assert res.json()["match"]["partner"]["username"] == eva["user"]["username"]


async def test_cannot_search_while_in_a_conversation(client, make_user):
    ana, _, _ = await paired(client, make_user)
    res = await search(client, ana, ["Viajes"])
    assert res.status_code == 409


async def test_users_who_already_met_are_not_paired_again(client, make_user, db):
    ana, luis, match = await paired(client, make_user)
    await travel(db, match["id"], 20)
    await search(client, ana, ["Música"])
    res = await search(client, luis, ["Música"])
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
    assert "terminó" in res.json()["detail"]


async def test_decision_only_from_day_seven(client, make_user, db):
    ana, luis, match = await paired(client, make_user)
    url = f"/matches/{match['id']}/decision"
    early = await client.post(url, json={"decision": "continue"}, headers=ana["headers"])
    assert early.status_code == 409
    assert "Faltan 6 días" in early.json()["detail"]

    await travel(db, match["id"], 6)
    ok = await client.post(url, json={"decision": "continue"}, headers=ana["headers"])
    assert ok.status_code == 204
    twice = await client.post(url, json={"decision": "leave"}, headers=ana["headers"])
    assert twice.status_code == 409

    assert (await client.get("/matches/current", headers=ana["headers"])).json() is None
    still = await client.get("/matches/current", headers=luis["headers"])
    assert still.json()["id"] == match["id"]


async def test_garden_lists_conversations_with_plant_stage(client, make_user, db):
    ana, _, match = await paired(client, make_user)
    await travel(db, match["id"], 3)
    res = await client.get("/garden", headers=ana["headers"])
    assert res.status_code == 200
    entries = res.json()
    assert len(entries) == 1
    assert entries[0]["stage"] == 3
    assert entries[0]["partnerName"]


async def test_simultaneous_searches_end_up_paired(client, make_user, db):
    import asyncio

    from sqlalchemy import func, select

    ana = await make_user("Ana", "ana@ejemplo.com")
    luis = await make_user("Luis", "luis@ejemplo.com")
    await asyncio.gather(search(client, ana, ["Música"]), search(client, luis, ["Música"]))

    states = [
        (await client.get("/matches/search", headers=u["headers"])).json() for u in (ana, luis)
    ]
    assert [s["status"] for s in states] == ["matched", "matched"]
    total = (await db.execute(select(func.count()).select_from(Match))).scalar()
    assert total == 1
