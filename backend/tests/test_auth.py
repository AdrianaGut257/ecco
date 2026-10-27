from tests.conftest import STRONG, code_sent_to


async def test_register_returns_session_and_generated_username(client):
    res = await client.post(
        "/auth/register",
        json={"name": "Sam Rivera", "email": "Sam@Ejemplo.com", "password": STRONG},
    )
    assert res.status_code == 201
    body = res.json()
    assert body["accessToken"]
    assert body["user"]["email"] == "sam@ejemplo.com"
    assert body["user"]["username"].startswith("Sam")
    assert body["user"]["interests"] == []
    assert "passwordHash" not in body["user"]


async def test_register_duplicate_email_is_friendly_conflict(client):
    payload = {"name": "Ana", "email": "ana@ejemplo.com", "password": STRONG}
    await client.post("/auth/register", json=payload)
    res = await client.post("/auth/register", json=payload)
    assert res.status_code == 409
    assert "iniciar sesión" in res.json()["detail"]


async def test_register_weak_password_explains_rules(client):
    res = await client.post(
        "/auth/register", json={"name": "Ana", "email": "ana@ejemplo.com", "password": "abc"}
    )
    assert res.status_code == 422
    assert "8 caracteres" in res.json()["detail"]


async def test_register_invalid_email(client):
    res = await client.post(
        "/auth/register", json={"name": "Ana", "email": "no-es-correo", "password": STRONG}
    )
    assert res.status_code == 422
    assert isinstance(res.json()["detail"], str)


async def test_login_success_and_me(client):
    await client.post(
        "/auth/register", json={"name": "Ana", "email": "ana@ejemplo.com", "password": STRONG}
    )
    res = await client.post("/auth/login", json={"email": "ANA@ejemplo.com", "password": STRONG})
    assert res.status_code == 200
    token = res.json()["accessToken"]
    me = await client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == "ana@ejemplo.com"


async def test_login_wrong_password_and_unknown_email_look_the_same(client):
    await client.post(
        "/auth/register", json={"name": "Ana", "email": "ana@ejemplo.com", "password": STRONG}
    )
    wrong = await client.post("/auth/login", json={"email": "ana@ejemplo.com", "password": "Otra#1234"})
    unknown = await client.post("/auth/login", json={"email": "nadie@ejemplo.com", "password": STRONG})
    assert wrong.status_code == unknown.status_code == 401
    assert wrong.json() == unknown.json()


async def test_login_is_rate_limited(client):
    for _ in range(10):
        await client.post("/auth/login", json={"email": "x@ejemplo.com", "password": "mala"})
    res = await client.post("/auth/login", json={"email": "x@ejemplo.com", "password": "mala"})
    assert res.status_code == 429


async def test_protected_routes_need_a_valid_token(client):
    assert (await client.get("/users/me")).status_code == 401
    bad = await client.get("/users/me", headers={"Authorization": "Bearer nope"})
    assert bad.status_code == 401


async def register(client, email="ana@ejemplo.com"):
    res = await client.post("/auth/register", json={"name": "Ana", "email": email, "password": STRONG})
    return {"Authorization": f"Bearer {res.json()['accessToken']}"}, res.json()["user"]


async def test_register_sends_a_verification_code(client, outbox):
    headers, user = await register(client)
    assert user["emailVerified"] is False
    assert len(outbox) == 1 and outbox[0]["to"] == "ana@ejemplo.com"
    code = code_sent_to(outbox, "ana@ejemplo.com")
    assert code in outbox[0]["subject"]

    wrong = "000000" if code != "000000" else "111111"
    bad = await client.post("/auth/verify-email", json={"code": wrong}, headers=headers)
    assert bad.status_code == 400 and "no coincide" in bad.json()["detail"]

    ok = await client.post("/auth/verify-email", json={"code": code}, headers=headers)
    assert ok.status_code == 200 and ok.json()["emailVerified"] is True
    me = await client.get("/users/me", headers=headers)
    assert me.json()["emailVerified"] is True


async def test_resending_invalidates_the_previous_code(client, outbox):
    headers, _ = await register(client)
    first = code_sent_to(outbox, "ana@ejemplo.com")
    assert (await client.post("/auth/resend-verification", headers=headers)).status_code == 204
    second = code_sent_to(outbox, "ana@ejemplo.com")
    assert len(outbox) == 2
    if first != second:
        old = await client.post("/auth/verify-email", json={"code": first}, headers=headers)
        assert old.status_code == 400
    assert (await client.post("/auth/verify-email", json={"code": second}, headers=headers)).status_code == 200


async def test_code_locks_after_too_many_attempts(client, outbox):
    headers, _ = await register(client)
    code = code_sent_to(outbox, "ana@ejemplo.com")
    wrong = "000000" if code != "000000" else "111111"
    for _ in range(4):
        await client.post("/auth/verify-email", json={"code": wrong}, headers=headers)
    locked = await client.post("/auth/verify-email", json={"code": wrong}, headers=headers)
    assert "demasiados intentos" in locked.json()["detail"]
    after = await client.post("/auth/verify-email", json={"code": code}, headers=headers)
    assert after.status_code == 400


async def test_unverified_users_cannot_search(client, make_user):
    ana = await make_user("Ana", verified=False)
    res = await client.post("/matches", json={"hobbies": ["Películas"]}, headers=ana["headers"])
    assert res.status_code == 403
    assert res.json()["code"] == "unverified"


async def test_password_reset_with_code(client, outbox):
    await register(client)
    res = await client.post("/auth/forgot-password", json={"email": "ana@ejemplo.com"})
    assert res.status_code == 204
    assert len(outbox) == 2
    code = code_sent_to(outbox, "ana@ejemplo.com")

    new_password = "Nueva#2026"
    payload = {"email": "ana@ejemplo.com", "code": code, "password": new_password}
    assert (await client.post("/auth/reset-password", json=payload)).status_code == 204
    reuse = await client.post("/auth/reset-password", json={**payload, "password": "Otra#2026"})
    assert reuse.status_code == 400

    old = await client.post("/auth/login", json={"email": "ana@ejemplo.com", "password": STRONG})
    new = await client.post("/auth/login", json={"email": "ana@ejemplo.com", "password": new_password})
    assert old.status_code == 401
    assert new.status_code == 200
    assert new.json()["user"]["emailVerified"] is True


async def test_forgot_password_does_not_reveal_unknown_emails(client, outbox):
    res = await client.post("/auth/forgot-password", json={"email": "nadie@ejemplo.com"})
    assert res.status_code == 204
    assert outbox == []


async def test_reset_validates_the_code(client):
    bad = {"email": "ana@ejemplo.com", "code": "12ab", "password": STRONG}
    assert (await client.post("/auth/reset-password", json=bad)).status_code == 422
    unknown = {"email": "nadie@ejemplo.com", "code": "123456", "password": STRONG}
    assert (await client.post("/auth/reset-password", json=unknown)).status_code == 400
