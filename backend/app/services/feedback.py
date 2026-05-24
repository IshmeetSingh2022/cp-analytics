from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert as pg_insert
from app.models.user_topic_stats import UserTopicStats


def update_topic_score(
    db: Session,
    user_id: int,
    topic: str,
    verdict: str,
) -> None:
    score_change = 2 if verdict in ("OK", "AC") else -3

    stmt = pg_insert(UserTopicStats).values(
        user_id=user_id,
        topic=topic,
        score=50 + score_change,
    ).on_conflict_do_update(
        constraint="uq_user_topic",
        set_={
            "score": UserTopicStats.score + score_change,
        }
    )
    db.execute(stmt)