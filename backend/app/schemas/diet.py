from pydantic import BaseModel

from app.schemas.nutrition import CalculatorInput


class DietInput(CalculatorInput):
    preferences: str = "omnivore"
    restrictions: list[str] | None = None


class Meal(BaseModel):
    name: str
    foods: list[str]
    calories: int
    protein: int
    carbs: int
    fat: int


class DietPlan(BaseModel):
    breakfast: Meal
    lunch: Meal
    dinner: Meal
    snacks: list[Meal]
    total_calories: int
    notes: str
