import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio

PRODUCT_PAYLOAD = {
    "name": "Blazer Alfaiataria Preto",
    "description": "Blazer de alfaiataria com caimento perfeito",
    "category": "alfaiataria",
    "tags": ["new_in", "best_seller"],
    "price": 599.90,
    "sale_price": None,
    "stock": 10,
    "sizes": ["P", "M", "G"],
    "colors": [{"name": "Preto", "hex": "#1a1a1a"}],
    "images": [],
}


async def test_list_products_empty(client: AsyncClient):
    resp = await client.get("/api/v1/products")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data


async def test_list_products_with_filters(client: AsyncClient):
    resp = await client.get("/api/v1/products?category=alfaiataria&min_price=100&page=1")
    assert resp.status_code == 200


async def test_get_product_not_found(client: AsyncClient):
    resp = await client.get("/api/v1/products/produto-inexistente")
    assert resp.status_code == 404


async def test_admin_create_product_forbidden(client: AsyncClient, auth_headers: dict):
    """Regular user cannot create products"""
    resp = await client.post("/api/v1/admin/products", json=PRODUCT_PAYLOAD, headers=auth_headers)
    assert resp.status_code == 403
