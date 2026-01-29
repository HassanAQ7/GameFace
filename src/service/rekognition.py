import logging

from src.config import settings
import boto3

from src.models.models import EmotionResult


class RekognitionService:
    def get_user_emotions(self, image: bytes) -> EmotionResult:
        session = boto3.Session(
            aws_access_key_id=settings.AWS_ACCESS_KEY,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
            profile_name=settings.AWS_PROFILE_NAME
        )

        client = session.client('rekognition')
        logging.info("Getting user emotions from Rekognition")
        response = client.detect_faces(Image={"Bytes": image}, Attributes=["ALL"])
        detected_emotion = response['FaceDetails']['Emotions'][0]
        logging.info(f"Rekognition detected {detected_emotion['Type']} with confidence {detected_emotion['Confidence']}")
        emotion_result = EmotionResult(
            confidence=detected_emotion['Confidence'],
            emotion=detected_emotion['Type']
        )

        return emotion_result


rekognition_service = RekognitionService()