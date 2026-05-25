import time
import logging

from fastapi import Request

# ✅ "uvicorn.access" ki jagah apna custom logger banao
# "cp_analytics" ek naya logger hai jiska koi special formatter nahi hai
# Isliye hum jitne bhi arguments dein, wo chalega
logger = logging.getLogger("cp_analytics")


async def logging_middleware(request: Request, call_next):
    start = time.perf_counter()

    response = await call_next(request)

    # perf_counter seconds mein hota hai, isliye *1000 karke ms mein convert karo
    duration_ms = (time.perf_counter() - start) * 1000

    # Ab ye bilkul safe hai — "cp_analytics" logger pe koi restriction nahi
    logger.info(
        "%s %s → %d  (%.1f ms)",
        request.method,       # GET, POST, etc.
        request.url.path,     # /auth/login, /profile/me, etc.
        response.status_code, # 200, 401, 404, etc.
        duration_ms,          # kitna time laga
    )

    return response