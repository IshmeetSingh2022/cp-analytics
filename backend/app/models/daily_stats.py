from sqlalchemy import Column, Integer, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base


class DailyStats(Base):

    __tablename__ = "daily_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    solved = Column(Integer, default=0)
    correct = Column(Integer, default=0)

    user = relationship("User", back_populates="daily_stats")

    __table_args__ = (
        UniqueConstraint("user_id", "date", name="uq_daily_stats_user_date"),
    )
