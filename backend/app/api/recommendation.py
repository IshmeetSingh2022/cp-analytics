from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.services.recommendation import recommend

router = APIRouter(prefix="/recommend", tags=["Recommendation"])


@router.get("/{user_id}")
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    problems = recommend(user_id, db)

    if not problems:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No recommendations found. Make sure the user exists and has submissions.",
        )

    return [
        {
            "id": p.id,
            "name": p.name,
            "contest_id": p.contest_id,
            "index": p.index,
            "rating": p.rating,
            "tags": p.tags,
        }
        for p in problems
    ]
