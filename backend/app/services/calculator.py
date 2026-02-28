from app.enums import ActivityLevel, Gender, Goal
from app.schemas.nutrition import CalculatorInput, CalculatorResult

ACTIVITY_MULTIPLIERS = {
    ActivityLevel.SEDENTARY: 1.2,
    ActivityLevel.LIGHT: 1.375,
    ActivityLevel.MODERATE: 1.55,
    ActivityLevel.HIGH: 1.725,
}

GOAL_ADJUSTMENTS = {
    Goal.MAINTAIN: 0.0,
    Goal.LOSE_FAT: -0.20,
    Goal.GAIN_MASS: 0.15,
}

PROTEIN_PER_KG = {
    Goal.LOSE_FAT: 2.2,
    Goal.GAIN_MASS: 2.0,
    Goal.MAINTAIN: 1.8,
}

MIN_CALORIES = 1200


def calculate_nutrition(data: CalculatorInput) -> CalculatorResult:
    # BMR — Mifflin-St Jeor formula
    if data.gender == Gender.MALE:
        bmr = (10 * data.weight_kg) + (6.25 * data.height_cm) - (5 * data.age) + 5
    else:
        bmr = (10 * data.weight_kg) + (6.25 * data.height_cm) - (5 * data.age) - 161

    # TDEE
    tdee = bmr * ACTIVITY_MULTIPLIERS[data.activity_level]

    # Calorie target adjusted for goal
    adjustment = GOAL_ADJUSTMENTS[data.goal]
    target_calories = max(MIN_CALORIES, int(tdee * (1 + adjustment)))

    # Macros
    protein = int(data.weight_kg * PROTEIN_PER_KG[data.goal])
    fat = int((target_calories * 0.27) / 9)
    carbs = int((target_calories - (protein * 4) - (fat * 9)) / 4)

    return CalculatorResult(
        bmr=int(bmr),
        tdee=int(tdee),
        target_calories=target_calories,
        protein_grams=protein,
        carbs_grams=carbs,
        fat_grams=fat,
        calorie_adjustment=target_calories - int(tdee),
        adjustment_percent=adjustment * 100,
    )
