import redis
from app.core.config import settings

try:
    r = redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        decode_responses=True,
    )
    r.ping()  # test connection
except Exception:
    r = None