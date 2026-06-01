from fastapi import Request
from fastapi.responses import JSONResponse
from jose import jwt, JWTError

from app.core.config import settings

PUBLIC_ROUTES = {
    "/",
    "/auth/login",
    "/auth/signup",
    "/docs",
    "/openapi.json",
    "/redoc",
    "/admin/seed",
}

async def auth_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)

    if request.url.path in PUBLIC_ROUTES or request.url.path.startswith("/docs"):
        return await call_next(request)

    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse(
            status_code=401,
            content={"detail": "Authorization token missing or malformed"},
        )

    token = auth_header.split(" ", 1)[1]

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        request.state.user = payload.get("sub")
        request.state.user_id = payload.get("user_id")

    except JWTError:
        return JSONResponse(
            status_code=401,
            content={"detail": "Invalid or expired token"},
        )

    return await call_next(request)