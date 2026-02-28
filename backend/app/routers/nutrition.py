from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_user
from app.schemas.nutrition import CalculatorInput, CalculatorResult
from app.services.calculator import calculate_nutrition

router = APIRouter(prefix="/api/v1/nutrition")


@router.post("/calculate", response_model=CalculatorResult)
async def calculate_tdee(
    data: CalculatorInput,
    user_id: str = Depends(get_current_user),
) -> CalculatorResult:
    """Calculate BMR, TDEE, and recommended macros using Mifflin-St Jeor formula."""
    return calculate_nutrition(data)
