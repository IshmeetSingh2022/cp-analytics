from sqlalchemy import Column, Integer, String, UniqueConstraint

from app.core.database import Base


class Problem(Base):

    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    contest_id = Column(Integer, nullable=False)
    index = Column(String, nullable=False)
    name = Column(String, nullable=False)
    rating = Column(Integer, default=0)
    tags = Column(String, default="")

    __table_args__ = (
        UniqueConstraint("contest_id", "index", name="uq_problem_contest_index"),
    )
