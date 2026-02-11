from pydantic import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    RAWG_API_KEY: str
    AWS_ACCESS_KEY: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str
    AWS_PROFILE_NAME:str
    DYNAMO_DB_TABLE_NAME: str
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )



settings = Config()