from pydantic import BaseModel
from typing import Optional

class TopicCreate(BaseModel):
    title: str
    topics: list[str]
    difficulty_level: str
    order_index: int
    estimated_days: int

class TopicResponse(BaseModel):
    id: int
    title: str
    difficulty_level: str
    order_index: int
    estimated_days: int
    status: str