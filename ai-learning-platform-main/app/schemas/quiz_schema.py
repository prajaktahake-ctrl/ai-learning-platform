from pydantic import BaseModel
from typing import Dict

# class AnswerItem(BaseModel):
#     question_id: int
#     selected_option: str  # 'a', 'b', 'c', or 'd'

class QuizSubmitRequest(BaseModel):
    answers: Dict[int, str]  # question_id -> selected option
    # answers: List[AnswerItem] 


class QuizSubmitResponse(BaseModel):
    score: int
    total: int
    correct_answers: Dict[int, str]