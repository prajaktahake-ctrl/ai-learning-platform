from pydantic import BaseModel
from datetime import date


class TopicCreate(BaseModel):
    title: str
    difficulty_level: str
    order_index: int
    estimated_days: int


class TopicResponse(BaseModel):
    id: int
    title: str
    difficulty_level: str
    order_index: int
    estimated_days: int
    completion_percentage: float
    status: str

    class Config:
        from_attributes = True