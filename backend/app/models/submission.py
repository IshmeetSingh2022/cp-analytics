from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Submission(Base):

    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(String, nullable=False, index=True)
    verdict = Column(String, nullable=False)
    tags = Column(String, default="")
    handle = Column(String, nullable=False, index=True)
    mistake_type = Column(String, default="none")
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    user = relationship("User", back_populates="submissions")
