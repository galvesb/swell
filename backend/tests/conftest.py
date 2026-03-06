import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

from app.main import app


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac


@pytest_asyncio.fixture
async def auth_headers(client: AsyncClient):
    # Register
    await client.post(
        "/api/v1/auth/register",
        json={"email": "test@swell.com", "password": "Test@1234", "full_name": "Test User"},
    )
    # Login
    resp = await client.post(
        "/api/v1/auth/login",
        data={"username": "test@swell.com", "password": "Test@1234"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
