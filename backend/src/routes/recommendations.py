import uuid

from fastapi import APIRouter, UploadFile, File
from fastapi.params import Header, Depends
from src.models.models import RecommendationResponse
from src.service.rekognition import rekognition_service, RekognitionService
from src.service.rawg import rawg_service, RawgService
from src.db.dynamodb import dynamodb_service, DynamoDBService
from typing import List
from datetime import  datetime
recommendations_router = APIRouter()


@recommendations_router.post("/get-recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    image: UploadFile = File(...),
    session_id: str = Header(..., alias="X-SESSION-ID"),
    rekognition: RekognitionService = Depends(lambda: rekognition_service),
    rawg: RawgService = Depends(lambda: rawg_service),
    dynamodb: DynamoDBService = Depends(lambda: dynamodb_service)):
    image_bytes = await image.read()
    emotion_detection = rekognition.get_user_emotions(image_bytes)
    games_recommendations = await rawg.get_recommendations(emotion_detection.emotion)
    recommendation = RecommendationResponse(
        session_id=session_id,
        recommendation_id=str(uuid.uuid4()),
        emotion=emotion_detection,
        recommendations=games_recommendations,
        timestamp=datetime.now()
    )
    dynamodb.put_recommendation(recommendation)
    return recommendation


@recommendations_router.get("/get-recent-recommendations", response_model=List[RecommendationResponse])
async def get_recent_recommendations(session_id: str, dynamodb: DynamoDBService = Depends(lambda: dynamodb_service)):
    recommendations = dynamodb.get_recent_recommendations(session_id)
    recent_recommendations = []
    for recommendation_item in recommendations:
        recommendation_response = RecommendationResponse(
            session_id=recommendation_item['session_id'],
            recommendation_id=recommendation_item['recommendation_id'],
            emotion=recommendation_item['emotion'],
            recommendations=recommendation_item['recommendations'],
            timestamp=datetime.fromtimestamp(recommendation_item['timestamp']/1000)
        )
        recent_recommendations.append(recommendation_response)

    return recent_recommendations
