from sqlalchemy.orm import Session
from datetime import date
from app.models.submission import Submission
from app.models.user import User
from app.services.feedback import update_topic_score
from app.services.stats_service import update_daily
from app.services.mistakes import get_mistake_type


def process_submission(
    db: Session,
    handle: str,
    pid: str,
    tags: list[str],
    verdict: str,
    actual_date:date
) -> None:
    """
    Store a submission if not already present, then update topic scores
    and daily stats for the owning user (looked up by handle).
    """
    existing = (
        db.query(Submission)
        .filter_by(problem_id=pid, handle=handle)
        .first()
    )

    if existing:
        return

    submission = Submission(
        problem_id=pid,
        verdict=verdict,
        tags=",".join(tags),
        handle=handle,
        mistake_type=get_mistake_type(verdict),
    )

    # Link to registered user if one exists
    user: User | None = db.query(User).filter_by(username=handle).first()
    if user:
        submission.user_id = user.id

    db.add(submission)
    
      
    
   
    if user:
        for tag in tags:
            update_topic_score(db, user.id, tag, verdict)

        update_daily(db, user.id, verdict,actual_date)
   
