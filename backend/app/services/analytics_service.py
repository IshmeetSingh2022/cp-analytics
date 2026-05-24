from collections import defaultdict

from app.models.submission import Submission


def get_topic_stats(subs: list[Submission]) -> list[dict]:
    stats: dict[str, list[int]] = defaultdict(lambda: [0, 0])

    for s in subs:
        tags = [t.strip() for t in s.tags.split(",")] if s.tags else []
        for tag in tags:
            if not tag:
                continue
            stats[tag][1] += 1
            if s.verdict in ("OK", "AC"):
                stats[tag][0] += 1

    result = []
    for tag, (solved, total) in stats.items():
        acc = solved / total if total else 0.0
        result.append(
            {
                "tag": tag,
                "solved": solved,
                "total": total,
                "accuracy": round(acc, 2),
            }
        )

    result.sort(key=lambda x: x["accuracy"])
    return result


def get_analysis(subs: list[Submission]) -> dict:
    stats = get_topic_stats(subs)

    strong = []
    weak = []

    for s in stats:
        if s["total"] < 5:
            continue
        if s["accuracy"] < 0.5:
            weak.append(s)
        elif s["accuracy"] > 0.7:
            strong.append(s)

    return {
        "weak": weak,
        "strong": strong,
        "all": stats,
        "top_weak": weak[:3],
    }


def get_progress(subs: list[Submission]) -> list[dict]:
    progress: dict[str, list[int]] = defaultdict(lambda: [0, 0])

    for s in subs:
        if s.created_at is None:
            continue
        day = str(s.created_at.date())
        progress[day][1] += 1
        if s.verdict in ("OK", "AC"):
            progress[day][0] += 1

    result = []
    for day, (solved, total) in progress.items():
        acc = solved / total if total else 0.0
        result.append({"date": day, "accuracy": round(acc, 2)})

    return sorted(result, key=lambda x: x["date"])
