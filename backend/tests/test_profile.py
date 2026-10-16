async def test_profile_update_sets_avatar_username_and_interests(client, make_user):
    ana = await make_user("Ana")
    res = await client.put(
        "/users/me",
        json={
            "username": "Ana09",
            "avatarId": "a3",
            "interests": ["Películas", "Series", "Pop", "Series"],
            "interestDetails": {"Películas": {"Género": ["Drama"]}},
            "termsAccepted": True,
        },
        headers=ana["headers"],
    )
    assert res.status_code == 200
    body = res.json()
    assert body["username"] == "Ana09"
    assert body["avatarId"] == "a3"
    assert body["interests"] == ["Películas", "Pop", "Series"]


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


async def test_unknown_avatar_rejected(client, make_user):
    ana = await make_user("Ana")
    res = await client.put("/users/me", json={"avatarId": "zzz"}, headers=ana["headers"])
    assert res.status_code == 422


async def test_needs_at_least_three_interests(client, make_user):
    ana = await make_user("Ana")
    res = await client.put("/users/me", json={"interests": ["Pop"]}, headers=ana["headers"])
    assert res.status_code == 422
    assert "al menos 3" in res.json()["detail"]


async def test_mood_is_saved_and_validated(client, make_user):
    ana = await make_user("Ana")
    ok = await client.post("/moods", json={"mood": "feliz"}, headers=ana["headers"])
    assert ok.status_code == 201
    bad = await client.post("/moods", json={"mood": "furioso"}, headers=ana["headers"])
    assert bad.status_code == 422
