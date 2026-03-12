from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class SubTopic(Base):
    __tablename__ = "subtopics"

    id = Column(Integer, primary_key=True, index=True)

    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)

    title = Column(String(200), nullable=False)

    topic = relationship("Topic", back_populates="subtopics")

    