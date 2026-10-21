import asyncio
import os
import sys

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

for key, value in {
    "APP_NAME": "ECCO",
    "ENVIRONMENT": "test",
    "DEBUG": "false",
    "POSTGRES_HOST": "localhost",
    "POSTGRES_PORT": "5432",
    "POSTGRES_DB": "postgres_app",
    "POSTGRES_USER": "postgres",
    "POSTGRES_PASSWORD": "postgres",
    "JWT_SECRET_KEY": "test-secret-key-for-ci-0123456789abcdef",
    "JWT_ALGORITHM": "HS256",
    "ACCESS_TOKEN_EXPIRE_MINUTES": "60",
    "SMTP_HOST": "localhost",
    "SMTP_PORT": "1025",
    "SMTP_FROM": "noreply@ecco.local",
    "SMTP_FROM_NAME": "ECCO",
    "CORS_ORIGINS": "http://localhost:8081",
}.items():
    os.environ.setdefault(key, value)

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from src.config.config import settings
from src.core import mail
from src.core.rate_limit import login_limiter, reset_limiter
from src.database.postgres import models  # noqa: F401
from src.database.postgres.base import Base
from src.database.postgres.database import get_db
from src.main import app


def _test_url() -> str:
    explicit = os.environ.get("TEST_DATABASE_URL")
    if explicit:
        return explicit
    return make_url(settings.database_url).set(database=f"{settings.postgres_db}_test").render_as_string(hide_password=False)


def _ensure_database(url: str) -> None:
    target = make_url(url)
    admin = create_engine(target.set(database="postgres"), isolation_level="AUTOCOMMIT")
    with admin.connect() as conn:
        exists = conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :n"), {"n": target.database}
        ).first()
        if not exists:
            conn.execute(text(f'CREATE DATABASE "{target.database}"'))
    admin.dispose()


@pytest_asyncio.fixture(scope="session")
async def engine():
    url = _test_url()
    _ensure_database(url)
    engine = create_async_engine(url, pool_pre_ping=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture(scope="session")
async def session_factory(engine):
    return async_sessionmaker(engine, expire_on_commit=False)


@pytest_asyncio.fixture(autouse=True)
async def clean_db(engine):
    async with engine.begin() as conn:
        tables = ", ".join(f'"{t.name}"' for t in Base.metadata.sorted_tables)
        await conn.execute(text(f"TRUNCATE {tables} RESTART IDENTITY CASCADE"))
    login_limiter.reset()
    reset_limiter.reset()


@pytest_asyncio.fixture
async def db(session_factory):
    async with session_factory() as session:
        yield session


@pytest_asyncio.fixture
async def client(session_factory):
    async def override():
        async with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test/api") as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def outbox(monkeypatch):
    sent: list[dict] = []

    async def fake_send(to, subject, text, html=None):
        sent.append({"to": to, "subject": subject, "text": text})

    monkeypatch.setattr(mail, "send_email", fake_send)
    return sent


STRONG = "Clave#2026"


@pytest.fixture
def make_user(client):
    async def _make(name="Ana", email=None, interests=None, avatar=None):
        email = email or f"{name.lower()}@ejemplo.com"
        res = await client.post(
            "/auth/register", json={"name": name, "email": email, "password": STRONG}
        )
        assert res.status_code == 201, res.text
        data = res.json()
        headers = {"Authorization": f"Bearer {data['accessToken']}"}
        payload = {
            "avatar": avatar or {"hair": "long", "glasses": "round"},
            "interests": interests or ["Películas", "Series", "Pop"],
            "termsAccepted": True,
        }
        res = await client.put("/users/me", json=payload, headers=headers)
        assert res.status_code == 200, res.text
        return {"headers": headers, "user": res.json(), "email": email}

    return _make
