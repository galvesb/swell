from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_product_service
from app.schemas.product import ProductFilters, ProductListResponse, ProductResponse
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=ProductListResponse)
async def list_products(
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    sizes: Annotated[list[str] | None, Query()] = None,
    colors: Annotated[list[str] | None, Query()] = None,
    tags: Annotated[list[str] | None, Query()] = None,
    sort_by: str = "relevance",
    page: int = 1,
    page_size: int = 20,
    service: ProductService = Depends(get_product_service),
) -> ProductListResponse:
    filters = ProductFilters(
        category=category,
        min_price=min_price,
        max_price=max_price,
        sizes=sizes,
        colors=colors,
        tags=tags,  # type: ignore[arg-type]
        sort_by=sort_by,  # type: ignore[arg-type]
        page=page,
        page_size=page_size,
    )
    return await service.list_products(filters)


@router.get("/{slug}", response_model=ProductResponse)
async def get_product(
    slug: str,
    service: ProductService = Depends(get_product_service),
) -> ProductResponse:
    return await service.get_by_slug(slug)
