from collections import defaultdict

from sqlalchemy.orm import Session

from app.models.problems import Problem
from app.models.submission import Submission
from app.models.user_topic_stats import UserTopicStats
from app.models.user import User


def _compute_recent_failures(
    db: Session,
    user_id: int,
    limit: int = 50,
) -> dict[str, int]:
    """
    Count recent non-OK submissions per tag so the recommender can
    boost problems in topics where the user is currently struggling.
    """
    recent = (
        db.query(Submission)
        .filter(
            Submission.user_id == user_id,
            Submission.verdict.notin_(["OK", "AC"]),
        )
        .order_by(Submission.created_at.desc())
        .limit(limit)
        .all()
    )

    failures: dict[str, int] = defaultdict(int)
    for sub in recent:
        tags = [t.strip() for t in sub.tags.split(",")] if sub.tags else []
        for tag in tags:
            if tag:
                failures[tag] += 1

    return dict(failures)


def score_problem(
    problem: Problem,
    topic_score: dict[str, int],
    user_rating: int,
    recent_failures: dict[str, int],
) -> float:
    tags = [t.strip() for t in problem.tags.split(",")] if problem.tags else []

    # Average weakness across all problem tags
    avg_weakness = (
        sum(100 - topic_score.get(tag, 50) for tag in tags) / len(tags)
        if tags
        else 50.0
    )

    diff_gap = abs((problem.rating or 0) - user_rating)

    # Sum of recent failure counts for this problem's tags
    recent_boost = sum(recent_failures.get(tag, 0) for tag in tags)

    return avg_weakness * 2 - diff_gap * 0.1 + recent_boost * 5


def recommend(user_id: int, db: Session) -> list[Problem]:
    user: User | None = db.query(User).filter_by(id=user_id).first()
    if not user:
        return []

    problems = db.query(Problem).all()

    solved_ids = {
        row[0]
        for row in db.query(Submission.problem_id).filter_by(user_id=user_id).all()
    }

    topic_score = {
        s.topic: s.score
        for s in db.query(UserTopicStats).filter_by(user_id=user_id).all()
    }

    recent_failures = _compute_recent_failures(db, user_id)

    unsolved = [p for p in problems if str(p.id) not in solved_ids]

    ranked = sorted(
        unsolved,
        key=lambda p: score_problem(p, topic_score, user.rating, recent_failures),
        reverse=True,
    )

    used_tags: set[str] = set()
    final: list[Problem] = []

    for p in ranked:
        tags = {t.strip() for t in p.tags.split(",")} if p.tags else set()
        # Ensure variety — skip if all tags already covered
        if tags and tags.issubset(used_tags):
            continue
        used_tags.update(tags)
        final.append(p)
        if len(final) == 5:
            break

    return final
