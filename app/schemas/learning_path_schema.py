from pydantic import BaseModel
from datetime import date
from typing import List
from app.schemas.topic_schema import TopicResponse


class LearningPathCreate(BaseModel):
    title: str
    start_date: date
    estimated_completion_date: date


class LearningPathResponse(BaseModel):
    id: int
    title: str
    start_date: date
    estimated_completion_date: date
    status: str

    topics: List[TopicResponse] = []

    class Config:
        from_attributes = True