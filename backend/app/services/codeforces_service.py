import json
import requests 
from app.core.cache import r


def fetch_user_submissions(handle: str) -> list[dict]:

    start=1
    all_submissions=[]
    batch_size=200
    cache_key = f"submissions:{handle}"

    if r is not None:
        cached = r.get(cache_key)
        if cached:
            return json.loads(cached)
    
    url = "https://codeforces.com/api/user.status"
    
    while True:
       
        params = {"handle": handle, "from": start, "count": batch_size}
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data.get("status") != "OK":
            raise ValueError(f"Codeforces API error: {data.get('comment', 'unknown')}")
        batch=data["result"]
        all_submissions.extend(batch)
        if len(batch)<batch_size:
            break
        
        start+=batch_size
        if(start>1000):
            break
        

        

    if r is not None:
        r.setex(cache_key, 3600, json.dumps(all_submissions))

    return all_submissions


def fetch_user_rating(handle: str) -> int:
    cache_key = f"rating:{handle}"

    if r is not None:
        cached = r.get(cache_key)
        if cached:
            return int(cached)

    url = "https://codeforces.com/api/user.info"
    params = {"handles": handle}          # ✅ Bug 1 fix
    res = requests.get(url, params=params, timeout=10)
    res.raise_for_status()
    data = res.json()

    if data.get("status") != "OK":
        return 0

    rating = data["result"][0].get("rating", 0)  # ✅ Bug 2 fix

    if r is not None:
        r.setex(cache_key, 3600, str(rating))

    return rating


def fetch_problemset() -> list[dict]:
    url = "https://codeforces.com/api/problemset.problems"
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    data = response.json()

    if data.get("status") != "OK":
        raise ValueError("Failed to fetch problemset from Codeforces API")

    return data["result"]["problems"]