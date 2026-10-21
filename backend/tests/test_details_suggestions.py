import uuid

import pytest

from src.config.config import settings
from src.modules.matches.models import MatchRequest
from src.modules.suggestions import service as suggestions
from src.modules.suggestions.router import suggest_limiter


async def put(client, user, payload):
    return await client.put("/users/me", json=payload, headers=user["headers"])


async def test_details_are_cleaned_saved_and_returned(client, make_user):
    ana = await make_user("Ana")
    res = await put(client, ana, {
        "interestDetails": {
            "Películas": {"Acción": ["  Iron   Man 2 ", "iron man 2", "Avatar"], "general": ["Coco"]},
            "Surf": {"general": ["Ola"]},
        },
    })
    assert res.status_code == 200, res.text
    details = res.json()["interestDetails"]
    assert details == {"Películas": {"Acción": ["Iron Man 2", "Avatar"], "general": ["Coco"]}}

    me = await client.get("/users/me", headers=ana["headers"])
    assert me.json()["interestDetails"] == details


async def test_details_survive_and_reset_with_interest_changes(client, make_user):
    ana = await make_user("Ana")
    await put(client, ana, {"interestDetails": {"Series": {"Drama": []}}})
    res = await put(client, ana, {"interests": ["Series", "Pop", "Rock"]})
    assert res.json()["interestDetails"] == {"Series": {"Drama": []}}
    cleared = await put(client, ana, {"interestDetails": {}})
    assert cleared.json()["interestDetails"] == {}


async def test_details_limits(client, make_user):
    ana = await make_user("Ana")
    many = {"Películas": {"general": [f"Peli {i}" for i in range(16)]}}
    assert (await put(client, ana, {"interestDetails": many})).status_code == 422
    long = {"Películas": {"general": ["x" * 81]}}
    assert (await put(client, ana, {"interestDetails": long})).status_code == 422


async def test_matching_prefers_and_shows_specific_shared_tastes(client, make_user, db):
    ana = await make_user("Ana", "ana@ejemplo.com", ["Películas", "Series", "Pop"])
    luis = await make_user("Luis", "luis@ejemplo.com", ["Películas", "Series", "Pop"])
    eva = await make_user("Eva", "eva@ejemplo.com", ["Películas", "Series", "Pop"])
    await put(client, ana, {"interestDetails": {"Películas": {"Acción": ["Iron Man 2"]}}})
    await put(client, eva, {"interestDetails": {"Películas": {"accion": ["iron man 2"]}}})
    for person in (luis, eva):
        db.add(MatchRequest(user_id=uuid.UUID(person["user"]["id"]), hobbies=["Películas"]))
    await db.commit()

    res = await client.post("/matches", json={"hobbies": ["Películas"]}, headers=ana["headers"])
    match = res.json()["match"]
    assert match["partner"]["username"] == eva["user"]["username"]
    assert match["sharedFavorites"] == [
        {"interest": "Películas", "kind": "subtopic", "label": "Acción"},
        {"interest": "Películas", "kind": "item", "label": "Iron Man 2"},
    ]


@pytest.fixture
def kg(monkeypatch):
    calls: list[tuple[str, list[str]]] = []

    async def fake_fetch(query, types):
        calls.append((query, types))
        return [
            {"result": {"name": "Iron Man 2", "description": "Película de 2010"}},
            {"result": {"name": "Iron Man 2", "description": "Duplicado"}},
            {"result": {"name": "Iron Man 3"}},
        ]

    monkeypatch.setattr(settings, "google_kg_api_key", "test-key")
    monkeypatch.setattr(suggestions, "fetch_entities", fake_fetch)
    suggestions.clear_cache()
    suggest_limiter.reset()
    return calls


async def test_suggestions_use_types_for_the_interest_and_cache(client, make_user, kg):
    ana = await make_user("Ana")
    params = {"q": "iron ma", "interest": "Películas"}
    res = await client.get("/suggestions", params=params, headers=ana["headers"])
    assert res.status_code == 200
    assert res.json() == [
        {"name": "Iron Man 2", "description": "Película de 2010"},
        {"name": "Iron Man 3", "description": None},
    ]
    assert kg == [("iron ma", ["Movie", "MovieSeries"])]

    await client.get("/suggestions", params={"q": "Iron Ma", "interest": "Películas"}, headers=ana["headers"])
    assert len(kg) == 1

    await client.get("/suggestions", params={"q": "metal", "interest": "Rock"}, headers=ana["headers"])
    assert kg[-1][1] == ["MusicGroup", "Person", "MusicAlbum", "MusicRecording"]


async def test_suggestions_without_key_return_nothing(client, make_user, monkeypatch):
    monkeypatch.setattr(settings, "google_kg_api_key", None)
    ana = await make_user("Ana")
    res = await client.get("/suggestions", params={"q": "iron", "interest": "Películas"}, headers=ana["headers"])
    assert res.status_code == 200
    assert res.json() == []


async def test_suggestions_validate_and_require_login(client, make_user, kg):
    ana = await make_user("Ana")
    short = await client.get("/suggestions", params={"q": "i", "interest": "Películas"}, headers=ana["headers"])
    assert short.status_code == 422
    anon = await client.get("/suggestions", params={"q": "iron", "interest": "Películas"})
    assert anon.status_code == 401
