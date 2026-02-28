from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_user
from app.schemas.diet import DietInput, DietPlan
from app.schemas.nutrition import CalculatorInput, CalculatorResult
from app.services.calculator import calculate_nutrition
from app.services.diet_ai import generate_diet_plan

router = APIRouter(prefix="/api/v1/nutrition")


@router.post("/calculate", response_model=CalculatorResult)
async def calculate_tdee(
    data: CalculatorInput,
    user_id: str = Depends(get_current_user),
) -> CalculatorResult:
    """Calculate BMR, TDEE, and recommended macros using Mifflin-St Jeor formula."""
    return calculate_nutrition(data)


@router.post("/diet", response_model=DietPlan)
async def create_diet_plan(
    data: DietInput,
    user_id: str = Depends(get_current_user),
) -> DietPlan:
    """Generate an AI-powered personalized diet plan."""
    nutrition = calculate_nutrition(data)
    return await generate_diet_plan(nutrition, data.preferences, data.restrictions)
