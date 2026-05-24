from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base


class UserTopicStats(Base):

    __tablename__ = "user_topic_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic = Column(String, nullable=False)
    score = Column(Integer, default=50)

    user = relationship("User", back_populates="topic_stats")

    __table_args__ = (
        UniqueConstraint("user_id", "topic", name="uq_user_topic"),
    )
