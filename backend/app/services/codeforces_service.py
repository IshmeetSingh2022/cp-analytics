import json
import requests
from app.core.cache import r


def fetch_user_submissions(handle: str) -> list[dict]:
    cache_key = f"submissions:{handle}"

    if r is not None:
        cached = r.get(cache_key)
        if cached:
            return json.loads(cached)

    url = "https://codeforces.com/api/user.status"
    params = {"handle": handle, "from": 1, "count": 200}
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()

    if data.get("status") != "OK":
        raise ValueError(f"Codeforces API error: {data.get('comment', 'unknown')}")

    submissions = data["result"]

    if r is not None:
        r.setex(cache_key, 3600, json.dumps(submissions))

    return submissions


def fetch_problemset() -> list[dict]:
    url = "https://codeforces.com/api/problemset.problems"
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    data = response.json()

    if data.get("status") != "OK":
        raise ValueError("Failed to fetch problemset from Codeforces API")

    return data["result"]["problems"]