import pytest

from app.schemas.nutrition import ActivityLevel, CalculatorInput, Gender, Goal
from app.services.calculator import calculate_nutrition


def make_input(**kwargs) -> CalculatorInput:
    defaults = {
        "age": 25,
        "gender": Gender.MALE,
        "height_cm": 175.0,
        "weight_kg": 75.0,
        "activity_level": ActivityLevel.MODERATE,
        "goal": Goal.MAINTAIN,
    }
    return CalculatorInput(**{**defaults, **kwargs})


def test_bmr_male():
    result = calculate_nutrition(make_input())
    # (10*75) + (6.25*175) - (5*25) + 5 = 750 + 1093.75 - 125 + 5 = 1723
    assert result.bmr == 1723


def test_bmr_female():
    result = calculate_nutrition(make_input(gender=Gender.FEMALE))
    # (10*75) + (6.25*175) - (5*25) - 161 = 750 + 1093.75 - 125 - 161 = 1557
    assert result.bmr == 1557


def test_tdee_moderate():
    result = calculate_nutrition(make_input())
    # tdee uses unrounded bmr float internally, so we check it's in the right range
    assert 2650 < result.tdee < 2700


def test_goal_lose_fat_creates_deficit():
    result = calculate_nutrition(make_input(goal=Goal.LOSE_FAT))
    assert result.target_calories < result.tdee
    assert result.adjustment_percent == -20.0


def test_goal_gain_mass_creates_surplus():
    result = calculate_nutrition(make_input(goal=Goal.GAIN_MASS))
    assert result.target_calories > result.tdee
    assert result.adjustment_percent == 15.0


def test_minimum_calories_floor():
    # Very low inputs should still respect the 1200 kcal floor
    result = calculate_nutrition(
        make_input(weight_kg=30, height_cm=100, age=100, goal=Goal.LOSE_FAT)
    )
    assert result.target_calories >= 1200


def test_macros_are_positive():
    result = calculate_nutrition(make_input())
    assert result.protein_grams > 0
    assert result.carbs_grams > 0
    assert result.fat_grams > 0
