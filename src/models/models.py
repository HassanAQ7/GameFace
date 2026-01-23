from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class EmotionResult(BaseModel):
    confidence: float
    emotion: str


class GameRecommendations(BaseModel):
    game_id: int = Field(alias="id")
    name: str
    slug: str
    released: str
    background_image: str
    rating: Optional[float]
    ratings_count: Optional[int]
    metacritic: Optional[int]
    playtime: int
    genres: List[Dict[str, Any]]
    tags: List[Dict[str, Any]]
    parent_platforms: List[Dict[str, Dict[str, Any]]]
    esrb_rating: Optional[Dict[str, Any]]



class AnalyzeResponse(BaseModel):
    recommendation_id: str
    session_id: str
    emotion: EmotionResult
    all_emotions: List[EmotionResult]
    recommendations: List[GameRecommendations]
    timestamp: datetime



