from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_user
from app.schemas.workout import WorkoutInput, WorkoutPlan
from app.services.workout_ai import generate_workout_plan

router = APIRouter(prefix="/api/v1/workout")


@router.post("/generate", response_model=WorkoutPlan)
async def create_workout(
    data: WorkoutInput,
    user_id: str = Depends(get_current_user),
) -> WorkoutPlan:
    """Generate an AI-powered personalized workout plan."""
    return await generate_workout_plan(
        goal=data.goal,
        days_per_week=data.days_per_week,
        experience_level=data.experience_level,
        limitations=data.limitations,
    )
