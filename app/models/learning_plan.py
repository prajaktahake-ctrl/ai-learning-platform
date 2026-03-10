from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.database import Base


class LearningStatus(str, enum.Enum):
    active = "active"
    completed = "completed"
    paused = "paused"


class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    title = Column(String(200), nullable=False)

    start_date = Column(Date, nullable=False)

    estimated_completion_date = Column(Date, nullable=True)

    actual_completion_date = Column(Date, nullable=True)

    status = Column(Enum(LearningStatus), default=LearningStatus.active, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship (very important for ORM power)
    # user = relationship("User", backref="learning_paths")
    user = relationship("User", back_populates="learning_paths")
    topics = relationship("Topic", back_populates="learning_path")