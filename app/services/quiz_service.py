from sqlalchemy.orm import Session
from app.models.quiz import Quiz, Question
from app.models.subtopic import SubTopic
from app.models.topic import Topic
from app.llm.llm_provider import generate_json
import random
from app.models.quiz_result import QuizResult

def generate_subtopic_quiz(subtopic_id: int, user_id: int, db: Session):

    # ✅ Check existing
    existing = db.query(Quiz).filter(
        Quiz.user_id == user_id,
        Quiz.subtopic_id == subtopic_id,
        Quiz.type == "subtopic"
    ).first()

    if existing:
        return existing

    subtopic = db.query(SubTopic).filter(SubTopic.id == subtopic_id).first()

    seed = random.randint(1, 100000)

    prompt = f"""
    You are a JSON API.

    Return ONLY valid JSON.
    Do NOT include explanation.
    Do NOT include text.
    Do NOT include markdown.

    Generate 5 MCQs.

    Topic: {subtopic.title}
    

    RULES:
    - 4 options (a,b,c,d)
    - Only one correct answer
    - NO explanation
    - Return STRICT JSON ONLY

    FORMAT:
    [
      {{
        "question": "...",
        "a": "...",
        "b": "...",
        "c": "...",
        "d": "...",
        "answer": "a"
      }}
    ]

    Seed: {seed}
    """

    questions = generate_json(prompt)

    quiz = Quiz(
        user_id=user_id,
        type="subtopic",
        subtopic_id=subtopic_id
    )

    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    for q in questions:
        db.add(Question(
            quiz_id=quiz.id,
            question_text=q["question"],
            option_a=q["a"],
            option_b=q["b"],
            option_c=q["c"],
            option_d=q["d"],
            correct_option=q["answer"]
        ))
    # for q in questions:

    #     option_a = q.get("a") or q.get("option_a") or (q.get("options", [None]*4)[0])
    #     option_b = q.get("b") or q.get("option_b") or (q.get("options", [None]*4)[1])
    #     option_c = q.get("c") or q.get("option_c") or (q.get("options", [None]*4)[2])
    #     option_d = q.get("d") or q.get("option_d") or (q.get("options", [None]*4)[3])

    #     db.add(Question(
    #         quiz_id=quiz.id,
    #         question_text=q.get("question"),
    #         option_a=option_a,
    #         option_b=option_b,
    #         option_c=option_c,
    #         option_d=option_d,
    #         correct_option=q.get("answer", "a")
    #     ))

    db.commit()
    return quiz


def generate_topic_quiz(topic_id: int, user_id: int, db: Session):

    existing = db.query(Quiz).filter(
        Quiz.user_id == user_id,
        Quiz.topic_id == topic_id,
        Quiz.type == "topic"
    ).first()

    if existing:
        return existing

    topic = db.query(Topic).filter(Topic.id == topic_id).first()

    seed = random.randint(1, 100000)

    prompt = f"""
    You are a JSON API.

    Return ONLY valid JSON.
    Do NOT include explanation.
    Do NOT include text.
    Do NOT include markdown.

    Return ONLY valid JSON.
    Do NOT include explanation or text.

    Generate 10 MCQs.

    Topic: {topic.title}

    Each question MUST follow EXACT format:

    [
    {{
        "question": "...",
        "a": "...",
        "b": "...",
        "c": "...",
        "d": "...",
        "answer": "a"
    }}
    ]

    IMPORTANT:
    - Use ONLY keys: question, a, b, c, d, answer
    - Do NOT use 'options'
    - Do NOT change key names

    Seed: {seed}
    """

    questions = generate_json(prompt)

    quiz = Quiz(
        user_id=user_id,
        type="topic",
        topic_id=topic_id
    )

    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    for q in questions:

        option_a = q.get("a") or q.get("option_a") or (q.get("options", [None]*4)[0])
        option_b = q.get("b") or q.get("option_b") or (q.get("options", [None]*4)[1])
        option_c = q.get("c") or q.get("option_c") or (q.get("options", [None]*4)[2])
        option_d = q.get("d") or q.get("option_d") or (q.get("options", [None]*4)[3])

        db.add(Question(
            quiz_id=quiz.id,
            question_text=q.get("question"),
            option_a=option_a,
            option_b=option_b,
            option_c=option_c,
            option_d=option_d,
            correct_option=q.get("answer", "a")
        ))
    db.commit()
    return quiz


def get_quiz(quiz_id: int, db: Session):
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()

    return [
        {
            "question_id": q.id,
            "question": q.question_text,
            "options": {
                "a": q.option_a,
                "b": q.option_b,
                "c": q.option_c,
                "d": q.option_d
            }
        }
        for q in questions
    ]

def submit_quiz(quiz_id: int, user_id: int, answers: dict, db: Session):

    questions = db.query(Question).filter(
        Question.quiz_id == quiz_id
    ).all()

    score = 0
    correct_answers = {}

    for q in questions:
        correct_answers[q.id] = q.correct_option

        user_answer = answers.get(q.id)
        print("Q:", q.id, "User:", user_answer, "Correct:", q.correct_option)

        if user_answer and user_answer == q.correct_option:
            score += 1

    result = QuizResult(
        user_id=user_id,
        quiz_id=quiz_id,
        score=score,
        total=len(questions)
    )

    db.add(result)
    db.commit()

    return {
        "Message": "Quiz submitted successfully. Here are your results.",
        "score": score,
        "total": len(questions),
        "correct_answers": correct_answers
    }

def get_user_quiz_results(user_id: int, db: Session):

    quizzes = db.query(Quiz).filter(
        Quiz.user_id == user_id
    ).all()

    result_data = []

    for quiz in quizzes:

        result = db.query(QuizResult).filter(
            QuizResult.quiz_id == quiz.id
        ).first()

        result_data.append({
            "quiz_id": quiz.id,
            "type": quiz.type,
            "topic_id": quiz.topic_id,
            "subtopic_id": quiz.subtopic_id,
            "score": result.score if result else None,
            "total": result.total if result else None,
            "percentage": (
                (result.score / result.total) * 100
                if result and result.total > 0 else None
            )
        })

    return result_data