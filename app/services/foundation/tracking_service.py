from sqlalchemy.orm import Session
from app.models.learning_plan import LearningPath
from app.models.topic import Topic


def create_learning_path(db: Session, user_id: int, data):

    learning_path = LearningPath(
        user_id=user_id,
        title=data.title,
        start_date=data.start_date,
        estimated_completion_date=data.estimated_completion_date,
        status="active"
    )

    db.add(learning_path)
    db.commit()
    db.refresh(learning_path)

    return learning_path


def get_learning_paths(db: Session, user_id: int):

    return db.query(LearningPath).filter(
        LearningPath.user_id == user_id
    ).all()


def create_topic(db: Session, learning_path_id: int, data):

    topic = Topic(
        learning_path_id=learning_path_id,
        title=data.title,
        difficulty_level=data.difficulty_level,
        order_index=data.order_index,
        estimated_days=data.estimated_days,
        status="pending"
    )

    db.add(topic)
    db.commit()
    db.refresh(topic)

    return topic


def get_topics(db: Session, learning_path_id: int):

    return db.query(Topic).filter(
        Topic.learning_path_id == learning_path_id
    ).order_by(Topic.order_index).all()