from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.learning_path_schema import LearningPathCreate, LearningPathResponse
from app.services.foundation.tracking_service import create_learning_path, get_learning_paths

router = APIRouter(prefix="/learning-paths", tags=["Learning Paths"])


@router.post("/", response_model=LearningPathResponse)
def create_path(data: LearningPathCreate, db: Session = Depends(get_db)):

    user_id = 1  # replace with auth user later

    return create_learning_path(db, user_id, data)


@router.get("/", response_model=list[LearningPathResponse])
def list_paths(db: Session = Depends(get_db)):

    user_id = 1

    return get_learning_paths(db, user_id)