from sqlalchemy import Column, Integer, ForeignKey, DateTime
from datetime import datetime
from app.db.database import Base


class QuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    score = Column(Integer)
    total = Column(Integer)
    created_at = Column(DateTime, default=datetime.now)