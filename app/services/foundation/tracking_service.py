from sqlalchemy.orm import Session
from app.models.learning_plan import LearningPath
from app.models.topic import Topic
from app.models.subtopic import SubTopic
from datetime import date
from app.models.user import User
from app.services.quiz_service import generate_subtopic_quiz, generate_topic_quiz

def normalize_difficulty(value: str):
    value = value.lower()

    if "beginner" in value:
        return "Beginner"
    elif "intermediate" in value:
        return "Intermediate"
    elif "advanced" in value:
        return "Advanced"

    return "Beginner"

def create_learning_path(db: Session, email: str, start_date: date, llm_data: dict):
    
    learning_path = LearningPath(
        email=email,
        title=llm_data["title"],
        start_date=start_date,
        status="active"
    )

    db.add(learning_path)
    db.commit()
    db.refresh(learning_path)

    topics_response = []

    for topic_data in llm_data["topics"]:

        topic = Topic(
            learning_path_id=learning_path.id,
            title=topic_data["title"],
            difficulty_level=topic_data["difficulty_level"],
            order_index=topic_data["order_index"],
            estimated_days=topic_data["estimated_days"],
            status="pending"
        )

        db.add(topic)
        db.commit()
        db.refresh(topic)

        subtopics_response = []

        for i, sub in enumerate(topic_data["subtopics"]):

            sub_topic = SubTopic(
                topic_id=topic.id,
                title=sub,
                # order_index=i + 1,
                status="pending"
            )

            db.add(sub_topic)
            db.commit()
            db.refresh(sub_topic)

            subtopics_response.append({
                "subtopic_id": sub_topic.id,
                "title": sub_topic.title,
                "status": sub_topic.status
            })

        topics_response.append({
            "topic_id": topic.id,
            "title": topic.title,
            "subtopics": subtopics_response
        })


    return {
        "learning_path_id": learning_path.id,
        "title": learning_path.title,
        "topics": topics_response
    }


def get_learning_paths(db: Session, email: str):

    return db.query(LearningPath).filter(
        LearningPath.email == email
    ).all()


def get_topics(db: Session, learning_path_id: int):

    return db.query(Topic).filter(
        Topic.learning_path_id == learning_path_id
    ).order_by(Topic.order_index).all()


def get_dashboard_data(db: Session, email: str):

    paths = db.query(LearningPath).filter(
        LearningPath.email == email
    ).all()

    dashboard = []

    for path in paths:

        topics = db.query(Topic).filter(
            Topic.learning_path_id == path.id
        ).order_by(Topic.order_index).all()

        topic_list = []
        total_subtopics = 0
        completed_subtopics = 0

        for topic in topics:

            subs = db.query(SubTopic).filter(
                SubTopic.topic_id == topic.id
            ).all()

            topic_total = len(subs)
            topic_completed = len([subtopic for subtopic in subs if subtopic.status == "completed"])

            total_subtopics += topic_total
            completed_subtopics += topic_completed

            progress = int((topic_completed / topic_total) * 100) if topic_total else 0

            topic_list.append({
                "topic_id": topic.id,
                "title": topic.title,
                "progress": progress,
                "subtopics": [
                    {
                        "subtopic_id": subtopic.id,
                        "title": subtopic.title,
                        "status": subtopic.status
                    } for subtopic in subs
                ]
            })

        overall_progress = int((completed_subtopics / total_subtopics) * 100) if total_subtopics else 0

        dashboard.append({
            "learning_path_id": path.id,
            "title": path.title,
            "progress": overall_progress,
            "topics": topic_list
        })

    return dashboard



def complete_subtopic(db: Session, subtopic_id: int, user_id: int):

    subtopic = db.query(SubTopic).filter(
        SubTopic.id == subtopic_id
    ).first()

    if not subtopic:
        return None

    subtopic.status = "completed"
    db.commit()
    db.refresh(subtopic)

    result = {
        "subtopic_id": subtopic.id,
        "status": subtopic.status,
        "subtopic_quiz_id": None,
        "topic_quiz_id": None
    }

    # 🔥 1. Generate subtopic quiz
    sub_quiz = generate_subtopic_quiz(subtopic_id, user_id, db)
    result["subtopic_quiz_id"] = sub_quiz.id

    # 🔥 2. Check if all subtopics completed
    subtopics = db.query(SubTopic).filter(
        SubTopic.topic_id == subtopic.topic_id
    ).all()

    if all(s.status == "completed" for s in subtopics):
        topic_quiz = generate_topic_quiz(subtopic.topic_id, user_id, db)
        result["topic_quiz_id"] = topic_quiz.id

    return result