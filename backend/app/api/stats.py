from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.services.stats_service import get_user_stats

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get("/{user_id}")
def get_stats(user_id: int, db: Session = Depends(get_db)):
    return get_user_stats(user_id, db)
