from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.middleware.auth import auth_middleware
from app.middleware.logging import logging_middleware

# Import models so Base registers all tables before create_all()
import app.models  # noqa: F401

from app.api import auth, routes_user, recommendation, stats

app = FastAPI(
    title="CP Analytics AI",
    description="AI-powered Competitive Programming Analytics Platform",
    version="1.0.0",
)

# --- Middleware (order matters: outermost runs first) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(logging_middleware)
app.middleware("http")(auth_middleware)


# --- Database initialisation ---
@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


# --- Health check ---
@app.get("/", tags=["Health"])
def root():
    return {"message": "CP Analytics AI backend running 🚀"}


# --- Routers ---
app.include_router(auth.router)
app.include_router(routes_user.router)
app.include_router(recommendation.router)
app.include_router(stats.router)
