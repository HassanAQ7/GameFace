import logging

from botocore.exceptions import ClientError

from src.config import settings
import boto3

from src.models.models import EmotionResult


class RekognitionService:
    def get_user_emotions(self, image: bytes) -> EmotionResult:
        try:
            session = boto3.Session(
                aws_access_key_id=settings.AWS_ACCESS_KEY,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION,
                profile_name=settings.AWS_PROFILE_NAME
            )

            client = session.client('rekognition')
            logging.info("Getting user emotions from Rekognition")
            response = client.detect_faces(Image={"Bytes": image}, Attributes=["ALL"])
            if not response['FaceDetails']:
                logging.info("No faces detected in image, upload an image with clear view of face")
                raise ValueError("Could not detect any faces detected in image")
            if not response['FaceDetails'][0]['Emotions']:
                logging.info("No emotions detected in image")
                raise ValueError("Could not detect any emotions in image")

            detected_emotion = response['FaceDetails'][0]['Emotions'][0]
            logging.info(f"Rekognition detected {detected_emotion['Type']} with confidence {detected_emotion['Confidence']}")
            emotion_result = EmotionResult(
                confidence=detected_emotion['Confidence'],
                emotion=detected_emotion['Type']
            )

            return emotion_result
        
        except ClientError as e:
            logging.error(f"Could not get user emotions from Rekognition: {e.response['Error']['Message']}")
            raise
        except Exception as e:
            logging.error(f"Unknown error: {e}")
            raise


rekognition_service = RekognitionService()