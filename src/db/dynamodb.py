import logging

import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError
from src.config import settings
from src.models.models import RecommendationResponse


class DynamoDBService:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb',
                                       region_name=settings.AWS_REGION,
                                       aws_access_key_id=settings.AWS_ACCESS_KEY,
                                       aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        self.table = self.dynamodb.Table(settings.DYNAMO_DB_TABLE_NAME)

    def put_recommendation(self, session_id: str, recommendation: RecommendationResponse):
        try:
            logging.info("Attempting to put recommendation item in dynamodb")
            recommendation_item = {
                'session_id': recommendation.session_id,
                'recommendation_id': recommendation.recommendation_id,
                'emotion': recommendation.emotion,
                'recommendations': recommendation.recommendations,
                'timestamp': int(recommendation.timestamp.timestamp() * 1000)
            }
            self.table.put_item(Item=recommendation_item)
            logging.info("Successfully put recommendation in dynamodb table", recommendation_item)
        except ClientError as e:
            logging.error("Could not put recommendation in dynamodb table",
                          e.response['Error']['Message'])

    def get_recent_recommendations(self, session_id: str, limit: int = 10):
        try:
            logging.info("Attempting to get recent recommendations from dynamodb")
            recent_recommendations = self.table.query(
                KeyConditionExpression=Key('session_id').eq(session_id),
                Limit=limit,
                ScanIndexForward=False
            )
        except ClientError as e:
            logging.error("Could not get recent recommendations", e.response['Error']['Message'])
        else:
            logging.info("Successfully retrieved recommendations from dynamodb", recent_recommendations['Items'])
            return recent_recommendations['Items']


dynamodb_service = DynamoDBService()