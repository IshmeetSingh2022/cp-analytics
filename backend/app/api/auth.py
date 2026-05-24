from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse
from app.dependencies.database import get_db
from app.services.auth_services import signup_user, login_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", status_code=201)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    return signup_user(data, db)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(data, db)
