import re

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    app_name: str
    environment: str
    debug: bool

    # PostgreSQL
    postgres_host: str
    postgres_port: int
    postgres_db: str
    postgres_user: str
    postgres_password: str

    # JWT
    jwt_secret_key: str
    jwt_algorithm: str
    access_token_expire_minutes: int = 60 * 24 * 7

    # Correo: con BREVO_API_KEY se envía por la API de Brevo (Render gratis bloquea SMTP); si no, por SMTP.
    smtp_host: str = "localhost"
    smtp_port: int = 1025
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from: str = "noreply@ecco.local"
    smtp_from_name: str = "ECCO"
    brevo_api_key: str | None = None

    # CORS
    cors_origins: str

    # App links
    frontend_url: str = "http://localhost:8081"
    email_code_expire_minutes: int = 15

    # Google Knowledge Graph Search (autocompletado de intereses)
    google_kg_api_key: str | None = None

    # Optional full database URL (overrides the POSTGRES_* values)
    database_url_env: str | None = Field(default=None, alias="DATABASE_URL")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
        populate_by_name=True,
    )

    @property
    def database_url(self) -> str:
        if self.database_url_env:
            # Neon y Render la entregan como postgres:// o postgresql://; SQLAlchemy necesita el driver.
            return re.sub(r"^postgres(ql)?://", "postgresql+psycopg://", self.database_url_env)
        return (
            f"postgresql+psycopg://"
            f"{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}"
            f"/{self.postgres_db}"
        )

settings = Settings()