import pytest

from src.core.moderation import classify
from src.modules.matches.constants import MESSAGES_PER_DAY
from tests.test_matches_chat import paired


@pytest.mark.parametrize(
    "text",
    [
        "Hola, ¿cómo estás?",
        "Mi computadora se rompió",
        "Comí peras y manzanas",
        "la zorra del cuento",
        "mi perra se llama Luna",
        "llámame cuando puedas",
        "qué feo día hace hoy",
    ],
)
def test_everyday_messages_pass(text):
    assert classify(text) == "ok"


@pytest.mark.parametrize("text", ["Eres un idiota", "Cállate", "callateee", "tooonto", "qué aburrido eres"])
def test_rude_messages_are_mild(text):
    assert classify(text) == "mild"


@pytest.mark.parametrize(
    "text",
    ["Hijo de puta", "h1j0 d3 put4", "p u t a", "p.u.t.a", "hijodeputa", "te voy a matar", "pasa el pack", "eres una zorra"],
)
def test_hurtful_or_disguised_messages_are_severe(text):
    assert classify(text) == "severe"


async def send(client, user, match_id, text, confirmed=False):
    return await client.post(
        f"/matches/{match_id}/messages",
        json={"text": text, "confirmed": confirmed},
        headers=user["headers"],
    )


async def test_severe_message_is_blocked_and_not_counted(client, make_user):
    ana, luis, match = await paired(client, make_user)
    res = await send(client, ana, match["id"], "eres una p u t a")
    assert res.status_code == 400
    assert res.json()["code"] == "blocked"

    seen = await client.get(f"/matches/{match['id']}/messages", headers=luis["headers"])
    assert seen.json() == []
    current = await client.get(f"/matches/{match['id']}", headers=ana["headers"])
    assert current.json()["messagesLeft"] == MESSAGES_PER_DAY


async def test_mild_message_asks_to_reconsider_then_allows(client, make_user):
    ana, _, match = await paired(client, make_user)
    first = await send(client, ana, match["id"], "jaja eres tonto")
    assert first.status_code == 409
    assert first.json()["code"] == "gentle_check"

    confirmed = await send(client, ana, match["id"], "jaja eres tonto", confirmed=True)
    assert confirmed.status_code == 201

    friendly = await send(client, ana, match["id"], "¡Qué bueno leerte!")
    assert friendly.status_code == 201


async def test_offensive_names_are_rejected(client, make_user):
    res = await client.post(
        "/auth/register", json={"name": "Hdp", "email": "x@ejemplo.com", "password": "Clave#2026"}
    )
    assert res.status_code == 422
    ana = await make_user("Ana")
    rename = await client.put("/users/me", json={"username": "idiota99"}, headers=ana["headers"])
    assert rename.status_code == 422
    assert "cuide" in rename.json()["detail"]
