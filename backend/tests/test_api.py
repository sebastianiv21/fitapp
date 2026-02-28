import jwt
import pytest
from httpx import ASGITransport, AsyncClient

from app.config import settings
from app.main import app

TEST_USER_ID = "test-user-123"


def make_token(user_id: str = TEST_USER_ID) -> str:
    return jwt.encode({"sub": user_id}, settings.jwt_secret, algorithm="HS256")


@pytest.fixture
def auth_headers() -> dict:
    return {"Authorization": f"Bearer {make_token()}"}


@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_calculate_no_auth():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post("/api/v1/nutrition/calculate", json={})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_calculate_with_auth(auth_headers):
    payload = {
        "age": 25,
        "gender": "male",
        "height_cm": 175,
        "weight_kg": 75,
        "activity_level": "moderate",
        "goal": "maintain",
    }
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post(
            "/api/v1/nutrition/calculate",
            json=payload,
            headers=auth_headers,
        )
    assert response.status_code == 200
    data = response.json()
    assert "bmr" in data
    assert "tdee" in data
    assert "target_calories" in data
    assert "protein_grams" in data


@pytest.mark.asyncio
async def test_calculate_validation_error(auth_headers):
    payload = {
        "age": 5,  # below minimum 13
        "gender": "male",
        "height_cm": 175,
        "weight_kg": 75,
        "activity_level": "moderate",
        "goal": "maintain",
    }
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post(
            "/api/v1/nutrition/calculate",
            json=payload,
            headers=auth_headers,
        )
    assert response.status_code == 422
