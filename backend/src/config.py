from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    RAWG_API_KEY: str
    ACCESS_KEY: str
    SECRET_ACCESS_KEY: str
    REGION: str
    DYNAMO_DB_TABLE_NAME: str
    model_config = SettingsConfigDict(
        env_file="../.env",
        env_file_encoding="utf-8",
        extra="ignore"
    )



settings = Config()