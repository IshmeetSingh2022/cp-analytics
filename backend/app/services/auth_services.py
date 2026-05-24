from fastapi import HTTPException, status

from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse


def signup_user(data: SignupRequest, db: Session) -> dict:
    existing = db.query(User).filter_by(username=data.username).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )

    user = User(
        username=data.username,
        hashed_password=hash_password(data.password),
        rating=1200,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User created", "user_id": user.id}


def login_user(data: LoginRequest, db: Session) -> TokenResponse:
    user = db.query(User).filter_by(username=data.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    token = create_access_token({"sub": user.username, "user_id": user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,       # ← YE NAYA HAI
        "username": user.username  # ← YE BHI NAYA HAI
    }
