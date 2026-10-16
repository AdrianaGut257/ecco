from tests.conftest import STRONG


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


async def test_password_reset_flow(client, outbox):
    await client.post(
        "/auth/register", json={"name": "Ana", "email": "ana@ejemplo.com", "password": STRONG}
    )
    res = await client.post("/auth/forgot-password", json={"email": "ana@ejemplo.com"})
    assert res.status_code == 204
    assert len(outbox) == 1
    token = outbox[0]["text"].split("token=")[1].split()[0]

    new_password = "Nueva#2026"
    done = await client.post("/auth/reset-password", json={"token": token, "password": new_password})
    assert done.status_code == 204

    reuse = await client.post("/auth/reset-password", json={"token": token, "password": "Otra#2026"})
    assert reuse.status_code == 400

    old = await client.post("/auth/login", json={"email": "ana@ejemplo.com", "password": STRONG})
    new = await client.post("/auth/login", json={"email": "ana@ejemplo.com", "password": new_password})
    assert old.status_code == 401
    assert new.status_code == 200


async def test_forgot_password_does_not_reveal_unknown_emails(client, outbox):
    res = await client.post("/auth/forgot-password", json={"email": "nadie@ejemplo.com"})
    assert res.status_code == 204
    assert outbox == []


async def test_reset_with_garbage_token(client):
    res = await client.post("/auth/reset-password", json={"token": "x", "password": STRONG})
    assert res.status_code == 400
