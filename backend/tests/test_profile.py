async def test_profile_update_sets_avatar_username_and_interests(client, make_user):
    ana = await make_user("Ana")
    res = await client.put(
        "/users/me",
        json={
            "username": "Ana09",
            "avatar": {"skin": "4", "hair": "curly", "hairColor": "5", "freckles": True},
            "interests": ["Películas", "Series", "Pop", "Series"],
            "interestDetails": {"Películas": {"Género": ["Drama"]}},
            "termsAccepted": True,
        },
        headers=ana["headers"],
    )
    assert res.status_code == 200
    body = res.json()
    assert body["username"] == "Ana09"
    assert body["avatar"]["hair"] == "curly"
    assert body["avatar"]["hairColor"] == "5"
    assert body["avatar"]["freckles"] is True
    assert body["avatar"]["glasses"] == "none"
    assert body["interests"] == ["Películas", "Pop", "Series"]
    assert body["onboarded"] is True


async def test_new_account_is_not_onboarded_until_profile_is_complete(client):
    res = await client.post(
        "/auth/register",
        json={"name": "Nina", "email": "nina@ejemplo.com", "password": "Clave#2026"},
    )
    assert res.json()["user"]["onboarded"] is False
    assert res.json()["user"]["shareMood"] is True


async def test_username_must_be_unique_ignoring_case(client, make_user):
    await make_user("Ana", "ana@ejemplo.com")
    other = await make_user("Luis", "luis@ejemplo.com")
    first = await client.put("/users/me", json={"username": "Sam09"}, headers=other["headers"])
    assert first.status_code == 200
    ana = await make_user("Eva", "eva@ejemplo.com")
    clash = await client.put("/users/me", json={"username": "sam09"}, headers=ana["headers"])
    assert clash.status_code == 409
    assert "en uso" in clash.json()["detail"]


async def test_username_with_spaces_is_rejected(client, make_user):
    ana = await make_user("Ana")
    res = await client.put("/users/me", json={"username": "ana lopez"}, headers=ana["headers"])
    assert res.status_code == 422


async def test_unknown_avatar_option_rejected(client, make_user):
    ana = await make_user("Ana")
    res = await client.put("/users/me", json={"avatar": {"hair": "mohawk"}}, headers=ana["headers"])
    assert res.status_code == 422


async def test_avatar_accepts_new_styles(client, make_user):
    ana = await make_user("Ana")
    look = {"hair": "halfBun", "bangs": "choppy", "outfit": "vneck", "earrings": "hoops", "glasses": "wide", "headband": True}
    res = await client.put("/users/me", json={"avatar": look}, headers=ana["headers"])
    assert res.status_code == 200
    assert {k: res.json()["avatar"][k] for k in look} == look


async def test_avatar_accepts_boy_styles(client, make_user):
    leo = await make_user("Leo")
    look = {"kind": "boy", "hair": "quiff", "bangs": "quiff", "facialHair": "goatee", "outfit": "hoodie", "top": "13"}
    res = await client.put("/users/me", json={"avatar": look}, headers=leo["headers"])
    assert res.status_code == 200
    assert {k: res.json()["avatar"][k] for k in look} == look


def test_legacy_avatar_is_upgraded():
    from src.modules.users.avatar import avatar_from

    old = avatar_from({"skin": "3", "hair": "buzz", "hair_color": "4", "earring": True})
    assert (old.hair, old.bangs, old.earrings, old.skin, old.hair_color) == ("pixie", "short", "studs", "3", "4")
    assert avatar_from({"hair": "short", "earring": False}).earrings == "none"
    assert avatar_from({"outfit": "sweater"}).outfit == "tee"


async def test_needs_at_least_three_interests(client, make_user):
    ana = await make_user("Ana")
    res = await client.put("/users/me", json={"interests": ["Pop"]}, headers=ana["headers"])
    assert res.status_code == 422
    assert "al menos 3" in res.json()["detail"]


async def test_mood_is_saved_validated_and_listed(client, make_user):
    ana = await make_user("Ana")
    ok = await client.post("/moods", json={"mood": "feliz"}, headers=ana["headers"])
    assert ok.status_code == 201
    bad = await client.post("/moods", json={"mood": "furioso"}, headers=ana["headers"])
    assert bad.status_code == 422
    history = await client.get("/moods/me", headers=ana["headers"])
    assert [m["mood"] for m in history.json()] == ["feliz"]


async def test_share_mood_can_be_turned_off(client, make_user):
    ana = await make_user("Ana")
    res = await client.put("/users/me", json={"shareMood": False}, headers=ana["headers"])
    assert res.json()["shareMood"] is False
