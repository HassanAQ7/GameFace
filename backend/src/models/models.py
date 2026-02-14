from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class EmotionResult(BaseModel):
    confidence: float
    emotion: str


class GameRecommendation(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    game_id: int = Field(alias="id")
    name: str
    slug: str
    released: Optional[str]
    background_image: str
    rating: Optional[float]
    ratings_count: Optional[int]
    metacritic: Optional[int]
    playtime: int
    genres: List[Dict[str, Any]]
    tags: List[Dict[str, Any]]
    parent_platforms: List[Dict[str, Dict[str, Any]]]
    esrb_rating: Optional[Dict[str, Any]]



class RecommendationResponse(BaseModel):
    recommendation_id: str
    session_id: str
    emotion: EmotionResult
    recommendations: List[GameRecommendation]
    timestamp: datetime



