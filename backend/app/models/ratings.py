from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class UserRating(Base):

    __tablename__ = "user_ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    rating = Column(Integer, default=1200)

    user = relationship("User", back_populates="rating_record")
