import logging

import httpx
from src.models.models import GameRecommendation
from src.config import settings
from typing import List

EMOTION_CONFIG = {
    "HAPPY": {
        "genres": "platformer,racing,sports,arcade",
        "tags": "funny,colorful,multiplayer"
    },
    "SAD": {
        "genres": "adventure,indie,role-playing-games-rpg",
        "tags": "story-rich,atmospheric,emotional"
    },
    "ANGRY": {
        "genres": "action,shooter,fighting",
        "tags": "fast-paced,competitive,violent"
    },
    "CALM": {
        "genres": "puzzle,simulation,strategy,casual",
        "tags": "relaxing,singleplayer,atmospheric"
    },
    "SURPRISED": {
        "genres": "adventure,action",
        "tags": "horror,scary,atmospheric"
    },
    "CONFUSED": {
        "genres": "puzzle,strategy",
        "tags": "difficult,singleplayer"
    },
    "DISGUSTED": {
        "genres": "action,fighting",
        "tags": "dark,gore,violent"
    },
    "FEAR": {
        "genres": "adventure,action",
        "tags": "horror,survival,scary"
    }
}

API_URL = "https://api.rawg.io/api/games"


class RawgService:
    async def get_recommendations(self, emotion: str, limit: int = 10) -> List[GameRecommendation]:
        try:
            logging.info(f"Getting games from RAWG for {emotion}")
            async with httpx.AsyncClient() as client:
                response = await client.get(API_URL, params={
                    "key": settings.API_KEY,
                    "genres": EMOTION_CONFIG[emotion]["genres"],
                    "tags": EMOTION_CONFIG[emotion]["tags"],
                    "page_size": limit,
                    "ordering": "-rating"}, timeout=10)

                response.raise_for_status()
                data = response.json()
            logging.info("Successfully retrieved games from RAWG")
            return self.parse_response(data)


        except Exception as e:
            logging.error("Could not get games from RAWG", e)


    def parse_response(self, data: dict) -> List[GameRecommendation]:
        games_list = data["results"]
        games_recommendation = []
        for games in games_list:
            recommendation = GameRecommendation(
                id=games.get("id"),
                name=games.get("name"),
                slug=games.get("slug"),
                released=games.get("released"),
                background_image=games.get("background_image"),
                rating=games.get("rating"),
                ratings_count=games.get("ratings_count"),
                metacritic=games.get("metacritic"),
                playtime=games.get("playtime"),
                genres=games.get("genres"),
                tags=games.get("tags"),
                parent_platforms=games.get("parent_platforms"),
                esrb_rating=games.get("esrb_rating"),

            )
            games_recommendation.append(recommendation)

        return games_recommendation


rawg_service = RawgService()
