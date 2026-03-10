from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
import enum

from app.db.database import Base


class TopicStatus(str, enum.Enum):
    pending = "pending"
    ongoing = "ongoing"
    completed = "completed"


class DifficultyLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)

    learning_path_id = Column(Integer, ForeignKey("learning_paths.id"), nullable=False, index=True)

    title = Column(String(200), nullable=False)

    difficulty_level = Column(Enum(DifficultyLevel), nullable=False)

    order_index = Column(Integer, nullable=False)

    estimated_days = Column(Integer, nullable=True)

    actual_start_date = Column(Date, nullable=True)

    actual_end_date = Column(Date, nullable=True)

    completion_percentage = Column(Float, default=0)

    status = Column(Enum(TopicStatus), default=TopicStatus.pending)

    # relationship
    # learning_path = relationship("LearningPath", backref="topics")
    learning_path = relationship("LearningPath", back_populates="topics")