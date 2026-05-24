from pydantic import BaseModel


class UserResponse(BaseModel):
    id: int
    username: str
    rating: int

    model_config = {"from_attributes": True}


class ProblemResponse(BaseModel):
    id: int
    title: str
    topic: str

    model_config = {"from_attributes": True}
