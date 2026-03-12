from sqlalchemy.orm import Session
from app.models.learning_plan import LearningPath
from app.models.topic import Topic
from app.models.subtopic import SubTopic


def create_learning_path(db: Session, user_id: int, start_date, llm_data):

    learning_path = LearningPath(
        user_id=user_id,
        title=llm_data["title"],
        start_date=start_date,
        status="active"
    )

    db.add(learning_path)
    db.commit()
    db.refresh(learning_path)

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

        for i, sub in enumerate(topic_data["subtopics"]):

            sub_topic = SubTopic(
                topic_id=topic.id,
                title=sub,
                # order_index=i + 1,
                # status="pending"
            )

            db.add(sub_topic)

        db.commit()

    return learning_path


def get_learning_paths(db: Session, user_id: int):

    return db.query(LearningPath).filter(
        LearningPath.user_id == user_id
    ).all()


# def create_topic(db: Session, learning_path_id: int, data):

#     topic = Topic(
#         learning_path_id=learning_path_id,
#         title=data.title,
#         difficulty_level=data.difficulty_level,
#         order_index=data.order_index,
#         estimated_days=data.estimated_days,
#         status="pending"
#     )

#     db.add(topic)
#     db.commit()
#     db.refresh(topic)

#     return topic


def get_topics(db: Session, learning_path_id: int):

    return db.query(Topic).filter(
        Topic.learning_path_id == learning_path_id
    ).order_by(Topic.order_index).all()