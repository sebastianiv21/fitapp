from pydantic import BaseModel, Field

from app.enums import ActivityLevel, Gender, Goal

__all__ = ["ActivityLevel", "Gender", "Goal", "CalculatorInput", "CalculatorResult"]


class CalculatorInput(BaseModel):
    age: int = Field(..., ge=13, le=100)
    gender: Gender
    height_cm: float = Field(..., ge=100, le=250)
    weight_kg: float = Field(..., ge=30, le=300)
    activity_level: ActivityLevel
    goal: Goal


class CalculatorResult(BaseModel):
    bmr: int
    tdee: int
    target_calories: int
    protein_grams: int
    carbs_grams: int
    fat_grams: int
    calorie_adjustment: int
    adjustment_percent: float
