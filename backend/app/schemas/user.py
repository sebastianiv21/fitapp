from datetime import datetime

from pydantic import BaseModel, Field

from app.enums import ActivityLevel, Gender, Goal


class ProfileCreate(BaseModel):
    age: int = Field(..., ge=13, le=100)
    gender: Gender
    height_cm: float = Field(..., ge=100, le=250)
    weight_kg: float = Field(..., ge=30, le=300)
    activity_level: ActivityLevel
    goal: Goal


class ProfileResponse(BaseModel):
    id: str
    age: int
    gender: Gender
    height_cm: float
    weight_kg: float
    activity_level: ActivityLevel
    goal: Goal
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProgressCreate(BaseModel):
    weight_kg: float = Field(..., ge=20, le=400)
    notes: str | None = None


class ProgressResponse(BaseModel):
    id: str
    user_id: str
    weight_kg: float
    notes: str | None
    recorded_at: datetime

    model_config = {"from_attributes": True}
