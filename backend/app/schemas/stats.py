from datetime import date

from pydantic import BaseModel


class DailyStatsResponse(BaseModel):
    date: date
    solved: int
    correct: int

    model_config = {"from_attributes": True}


class TopicStatResponse(BaseModel):
    tag: str
    solved: int
    total: int
    accuracy: float


class AnalysisResponse(BaseModel):
    weak: list[TopicStatResponse]
    strong: list[TopicStatResponse]
    all: list[TopicStatResponse]
    top_weak: list[TopicStatResponse]


class ProgressPoint(BaseModel):
    date: str
    accuracy: float


class UserAnalysisResponse(BaseModel):
    analysis: AnalysisResponse
    progress: list[ProgressPoint]
