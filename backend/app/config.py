from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).parent.parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, env_file_encoding="utf-8")

    database_url: str = "postgresql+asyncpg://fitapp:fitapp_dev@localhost:5432/fitapp"
    jwt_secret: str = "dev-secret-change-in-prod"
    openai_api_key: str = ""
    cors_origins: list[str] = ["*"]
    environment: str = "development"


settings = Settings()
