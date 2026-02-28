from pydantic import BaseModel, Field


class WorkoutInput(BaseModel):
    goal: str
    days_per_week: int = Field(..., ge=1, le=7)
    experience_level: str = "beginner"
    limitations: list[str] | None = None


class Exercise(BaseModel):
    name: str
    sets: int
    reps: str
    rest_seconds: int
    notes: str | None = None


class WorkoutDay(BaseModel):
    day: str
    focus: str
    exercises: list[Exercise]
    duration_minutes: int


class WorkoutPlan(BaseModel):
    days: list[WorkoutDay]
    weekly_notes: str
