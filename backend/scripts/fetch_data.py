"""
Run this script once to seed initial submissions for a handle:

    python -m scripts.fetch_data <codeforces_handle>
"""

import sys

from app.services.codeforces_service import fetch_user_submissions
from app.services.submission import process_submission
from app.core.database import SessionLocal


def fetch_and_store_submissions(handle: str) -> int:
    """
    Fetch the latest 200 submissions for *handle* and persist them.
    Returns the number of new submissions stored.
    """
    db = SessionLocal()
    stored = 0

    try:
        data = fetch_user_submissions(handle)  # fixed: was fetch_user_submission

        for item in data[:200]:
            tags = item["problem"].get("tags", [])
            pid = str(item["problem"]["contestId"]) + item["problem"]["index"]
            verdict = item.get("verdict", "")
            if not verdict:
                continue

            process_submission(db, handle, pid, tags, verdict)
            stored += 1

        db.commit()

    except Exception as exc:
        db.rollback()
        print(f"Error: {exc}", file=sys.stderr)
        raise

    finally:
        db.close()

    return stored


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python -m scripts.fetch_data <handle>")
        sys.exit(1)

    handle = sys.argv[1]
    count = fetch_and_store_submissions(handle)
    print(f"Stored {count} submissions for {handle}.")
