from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert as pg_insert
from app.models.daily_stats import DailyStats


def get_user_stats(user_id: int, db: Session) -> list[dict]:
    rows = (
        db.query(DailyStats)
        .filter_by(user_id=user_id)
        .order_by(DailyStats.date)
        .all()
    )
    return [
        {"date": str(r.date), "solved": r.solved, "correct": r.correct}
        for r in rows
    ]


def update_daily(db: Session, user_id: int, verdict: str, sub_date: date) -> None:
    date = sub_date
    solved_increment = 1
    correct_increment = 1 if verdict in ("OK", "AC") else 0

    stmt = pg_insert(DailyStats).values(
        user_id=user_id,
        date=date,
        solved=solved_increment,
        correct=correct_increment,
    ).on_conflict_do_update(
        constraint="uq_daily_stats_user_date",
        set_={
            "solved": DailyStats.solved + solved_increment,
            "correct": DailyStats.correct + correct_increment,
        }
    )
    db.execute(stmt)