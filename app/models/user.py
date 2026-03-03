from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(150), unique=True, index=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    personality_mode = Column(String(50), nullable=False, default="fast-track")
    # examples: fast-track, deep-mastery, practical-only

    hours_per_day = Column(Integer, nullable=False, default=1)

    created_at = Column(DateTime(timezone=True), server_default=func.now())