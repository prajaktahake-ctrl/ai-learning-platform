from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.topic_schema import TopicCreate, TopicResponse
from app.services.foundation.tracking_service import get_topics

router = APIRouter(prefix="/topics", tags=["Topics"])


@router.post("/{learning_path_id}", response_model=TopicResponse)
def create_new_topic(
        learning_path_id: int,
        data: TopicCreate,
        db: Session = Depends(get_db)
):

    return create_new_topic(db, learning_path_id, data)


@router.get("/{learning_path_id}", response_model=list[TopicResponse])
def list_topics(
        learning_path_id: int,
        db: Session = Depends(get_db)
):

    return get_topics(db, learning_path_id)