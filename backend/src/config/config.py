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
    access_token_expire_minutes: int

    # SMTP
    smtp_host: str
    smtp_port: int
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from: str
    smtp_from_name: str

    # CORS
    cors_origins: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg://"
            f"{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}"
            f"/{self.postgres_db}"
        )


settings = Settings()