import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

TEST_USER_ID = "test-user-123"


@pytest.fixture
def auth_headers():
    """Override the auth dependency to return a test user ID."""
    from app.middleware.auth import get_current_user

    async def mock_get_current_user():
        return TEST_USER_ID

    app.dependency_overrides[get_current_user] = mock_get_current_user
    yield {"Authorization": "Bearer fake-token"}
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_calculate_no_auth():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
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
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
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
        "age": 5,
        "gender": "male",
        "height_cm": 175,
        "weight_kg": 75,
        "activity_level": "moderate",
        "goal": "maintain",
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/nutrition/calculate",
            json=payload,
            headers=auth_headers,
        )
    assert response.status_code == 422
