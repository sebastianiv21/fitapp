import json

from openai import AsyncOpenAI

from app.config import settings
from app.schemas.workout import WorkoutPlan

client = AsyncOpenAI(api_key=settings.openai_api_key)


async def generate_workout_plan(
    goal: str,
    days_per_week: int,
    experience_level: str = "beginner",
    limitations: list[str] | None = None,
) -> WorkoutPlan:
    """Generate a personalized workout plan using OpenAI GPT-4o-mini."""
    limitations_text = ", ".join(limitations) if limitations else "none"

    prompt = f"""Create a {days_per_week}-day weekly workout plan:
- Goal: {goal}
- Experience: {experience_level}
- Physical limitations: {limitations_text}

Return JSON with this exact structure:
{{
  "days": [
    {{
      "day": "Day 1",
      "focus": "Upper Body",
      "exercises": [
        {{"name": "...", "sets": 3, "reps": "8-12", "rest_seconds": 60, "notes": null}}
      ],
      "duration_minutes": 45
    }}
  ],
  "weekly_notes": "..."
}}
Include warm-up and cool-down recommendations in notes.
Keep exercises safe and appropriate for {experience_level} level."""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a certified personal trainer. Return only valid JSON.",
            },
            {"role": "user", "content": prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )

    content = response.choices[0].message.content
    if not content:
        raise ValueError("Empty response from OpenAI")
    return WorkoutPlan(**json.loads(content))
