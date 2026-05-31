from datetime import date
from app.models.submission import Submission

IMPORTANT_TOPICS = [
    "dp",
    "graphs",
    "trees",
    "binary search",
    "greedy",
    "two pointers",
    "sorting",
    "hashing",
    "recursion",
    "divide and conquer"
]


def _rating_score(cf_rating: int) -> float:
    if cf_rating <= 0:
        return 0.0
    return round(min(cf_rating, 2200) / 2200 * 35, 2)


def _topic_score(subs: list[Submission]) -> float:
    solved_topics = set()
    for s in subs:
        if s.verdict == "OK" and s.tags:
            for tag in s.tags.split(","):
                solved_topics.add(tag.strip().lower())

    covered = sum(
        1 for topic in IMPORTANT_TOPICS
        if topic in solved_topics
    )
    return round(covered / len(IMPORTANT_TOPICS) * 30, 2)


def _difficulty_score(subs: list[Submission]) -> float:
    ac_subs = [s for s in subs if s.verdict == "OK"]

    easy = medium = hard = expert = 0

    for s in ac_subs:
        if not s.problem_id:
            continue
        index = s.problem_id[-1].upper()

        if index in ["A", "B"]:
            easy += 1
        elif index in ["C", "D"]:
            medium += 1
        elif index in ["E", "F"]:
            hard += 1
        else:
            expert += 1

    score = 0
    score += min(easy,   100) / 100 * 4
    score += min(medium, 100) / 100 * 8
    score += min(hard,   50)  / 50  * 5
    score += min(expert, 20)  / 20  * 3

    return round(score, 2)


def _consistency_score(subs: list[Submission]) -> float:
    today = date.today()

    last_7_active = set(
        s.created_at.date()
        for s in subs
        if s.verdict == "OK"
        and (today - s.created_at.date()).days <= 7
    )

    last_30_active = set(
        s.created_at.date()
        for s in subs
        if s.verdict == "OK"
        and (today - s.created_at.date()).days <= 30
    )

    weekly  = min(len(last_7_active),  7)  / 7  * 7
    monthly = min(len(last_30_active), 20) / 20 * 8

    return round(weekly + monthly, 2)


def _get_suggestions(
    r_score: float,
    t_score: float,
    d_score: float,
    c_score: float,
    subs: list[Submission]
) -> list[str]:

    suggestions = []
    ac_subs = [s for s in subs if s.verdict == "OK"]

    easy = len([s for s in ac_subs
                if s.problem_id and
                s.problem_id[-1].upper() in ["A", "B"]])

    medium = len([s for s in ac_subs
                  if s.problem_id and
                  s.problem_id[-1].upper() in ["C", "D"]])

    hard = len([s for s in ac_subs
                if s.problem_id and
                s.problem_id[-1].upper() in ["E", "F", "G"]])

    if r_score < 25:
        if r_score == 0:
            suggestions.append("Participate in your first contest to get a rating 🏆")
        elif r_score < 10:
            suggestions.append("Focus on A and B level problems to improve your rating 📈")
        else:
            suggestions.append("Participate in contests regularly to improve your rating 🎯")

    if t_score < 20:
        solved_topics = set()
        for s in subs:
            if s.verdict == "OK" and s.tags:
                for tag in s.tags.split(","):
                    solved_topics.add(tag.strip().lower())

        missing = [
            topic for topic in IMPORTANT_TOPICS
            if topic not in solved_topics
        ]
        if missing:
            suggestions.append(
                f"Cover these important topics: {', '.join(missing[:3])} 📚"
            )

    if d_score < 10:
        if easy == 0 and medium == 0 and hard == 0:
            suggestions.append("Start with A and B level problems 🔰")
        elif medium == 0 and hard == 0:
            suggestions.append("Good start — now try C and D level problems 💪")
        elif hard == 0:
            suggestions.append("Medium problems done — now attempt E and F level 🔥")
        else:
            suggestions.append("Solve more hard problems to improve your difficulty score 📈")

    if c_score < 8:
        if c_score == 0:
            suggestions.append("Start today — solve at least 1 problem daily ⏰")
        else:
            suggestions.append("Practice daily — aim for 1 to 2 problems every day ⏰")

    if not suggestions:
        suggestions.append("Great work — keep participating in contests 🔥")

    return suggestions


def calculate_readiness(
    subs: list[Submission],
    cf_rating: int = 0
) -> dict:

    r = _rating_score(cf_rating)
    t = _topic_score(subs)
    d = _difficulty_score(subs)
    c = _consistency_score(subs)

    total = round(r + t + d + c)

    if total >= 80:
        label = "FAANG Ready 🔥"
    elif total >= 65:
        label = "Almost There 💪"
    elif total >= 50:
        label = "Getting Better ⚠️"
    elif total >= 30:
        label = "Keep Grinding 📚"
    else:
        label = "Just Starting ❌"

    suggestions = _get_suggestions(r, t, d, c, subs)

    return {
        "total": total,
        "label": label,
        "breakdown": {
            "cf_rating": {
                "score": r,
                "max":   35,
                "label": "CF Rating"
            },
            "topic_coverage": {
                "score": t,
                "max":   30,
                "label": "Topic Coverage"
            },
            "difficulty": {
                "score": d,
                "max":   20,
                "label": "Problem Difficulty"
            },
            "consistency": {
                "score": c,
                "max":   15,
                "label": "Consistency"
            }
        },
        "suggestions": suggestions
    }