import json

from openai import AsyncOpenAI

from app.config import settings
from app.schemas.diet import DietPlan
from app.services.calculator import CalculatorResult

client = AsyncOpenAI(api_key=settings.openai_api_key)


async def generate_diet_plan(
    nutrition: CalculatorResult,
    preferences: str = "omnivore",
    restrictions: list[str] | None = None,
) -> DietPlan:
    """Generate a personalized diet plan using OpenAI GPT-4o-mini."""
    restrictions_text = ", ".join(restrictions) if restrictions else "none"

    prompt = f"""Generate a daily meal plan with these requirements:
- Target calories: {nutrition.target_calories}
- Protein: {nutrition.protein_grams}g
- Carbs: {nutrition.carbs_grams}g
- Fat: {nutrition.fat_grams}g
- Diet preference: {preferences}
- Restrictions: {restrictions_text}

Return a JSON object with this exact structure:
{{
  "breakfast": {{"name": "...", "foods": ["..."], "calories": 0, "protein": 0, "carbs": 0, "fat": 0}},
  "lunch": {{"name": "...", "foods": ["..."], "calories": 0, "protein": 0, "carbs": 0, "fat": 0}},
  "dinner": {{"name": "...", "foods": ["..."], "calories": 0, "protein": 0, "carbs": 0, "fat": 0}},
  "snacks": [{{"name": "...", "foods": ["..."], "calories": 0, "protein": 0, "carbs": 0, "fat": 0}}],
  "total_calories": 0,
  "notes": "..."
}}
Use common, accessible foods with approximate portions in the foods list."""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a nutrition expert. Return only valid JSON.",
            },
            {"role": "user", "content": prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )

    content = response.choices[0].message.content
    if not content:
        raise ValueError("Empty response from OpenAI")
    return DietPlan(**json.loads(content))
