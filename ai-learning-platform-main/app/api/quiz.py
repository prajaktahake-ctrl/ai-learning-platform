from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.quiz_service import get_quiz
from app.schemas.quiz_schema import QuizSubmitRequest
from app.services.quiz_service import submit_quiz
from app.api.auth import get_current_user
from app.services.quiz_service import get_quiz
from app.services.quiz_service import get_user_quiz_results

router = APIRouter(prefix="/quiz", tags=["Quiz"])


@router.get("/{quiz_id}")
def fetch_quiz(quiz_id: int, db: Session = Depends(get_db)):
    return {
        "quiz_id": quiz_id,
        "questions": get_quiz(quiz_id, db)
    }

@router.post("/{quiz_id}/submit")
def submit(
    quiz_id: int,
    data: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return submit_quiz(
        quiz_id,
        current_user.id,
        data.answers,
        db
    )
@router.get("/dashboard/{email}")
def dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
    ):

    return {
        "message": f"Welcome to your quiz dashboard, {current_user.name}!",
        "results": get_user_quiz_results(current_user.id, db)
    }