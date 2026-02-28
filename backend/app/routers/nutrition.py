from fastapi import APIRouter

from app.schemas.nutrition import CalculatorInput, CalculatorResult
from app.services.calculator import calculate_nutrition

router = APIRouter(prefix="/api/v1/nutrition")


@router.post("/calculate", response_model=CalculatorResult)
async def calculate_tdee(data: CalculatorInput) -> CalculatorResult:
    """Calculate BMR, TDEE, and recommended macros using Mifflin-St Jeor formula."""
    return calculate_nutrition(data)
