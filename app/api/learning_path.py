# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session

# from app.db.session import get_db
# from app.schemas.learning_path_schema import LearningPathGenerateRequest , LearningPathResponse
# from app.services.foundation.tracking_service import create_learning_path, get_learning_paths

# router = APIRouter(prefix="/learning-paths", tags=["Learning Paths"])


# @router.post("/", response_model=LearningPathResponse)
# def create_path(data: LearningPathGenerateRequest, db: Session = Depends(get_db)):

#     user_id = 1  # replace with auth user later

#     return create_learning_path(db, user_id, data)


# @router.get("/", response_model=list[LearningPathResponse])
# def list_paths(db: Session = Depends(get_db)):

#     user_id = 1

#     return get_learning_paths(db, user_id)





from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import json
from app.db.session import get_db
from app.llm.learning_path_prompt import LEARNING_PATH_PROMPT
from app.llm.llm_provider import generate_text
from app.services.foundation.tracking_service import create_learning_path
from datetime import date

router = APIRouter()


# @router.post("/generate-learning-path")
# def generate_learning_path(request, db: Session = Depends(get_db)):

#     prompt = LEARNING_PATH_PROMPT.format(
#         goal=request.goal,
#         level=request.level,
#         duration_weeks=request.duration_weeks
#     )

#     data = generate_text(prompt)

#     learning_path = create_learning_path(
#         db=db,
#         user_id=request.user_id,
#         start_date=request.start_date,
#         llm_data=data
#     )

#     return {
#         "message": "Learning path generated successfully",
#         "learning_path_id": learning_path.id,
#         "topics_generated": len(data["topics"])
#     }

@router.post("/generate-learning-path")
def generate_learning_path(
    user_id: int = Query(..., description="User ID"),
    goal: str = Query(..., description="Skill to learn e.g. Python"),
    level: str = Query(..., description="Beginner | Intermediate | Advanced"),
    duration_weeks: int = Query(..., description="Number of weeks"),
    start_date: date = Query(..., description="Start date e.g. 2026-03-11"),
    db: Session = Depends(get_db)
):
    prompt = LEARNING_PATH_PROMPT.format(
        goal=goal,
        level=level,
        duration_weeks=duration_weeks
    )

    # data = generate_text(prompt)
    raw = generate_text(prompt)        # ← this is a string

    # LLM sometimes wraps response in ```json ... ``` so strip that
    clean = raw.strip().removeprefix("```json").removesuffix("```").strip()

    data = json.loads(clean)           # ← now it's a dict


    learning_path = create_learning_path(
        db=db,
        user_id=user_id,
        start_date=start_date,
        llm_data=data
    )

    return {
        "message": "Learning path generated successfully",
        "learning_path_id": learning_path.id,
        "topics_generated": len(data["topics"])
    }