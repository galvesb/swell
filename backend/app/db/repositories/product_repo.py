from typing import Optional
from math import ceil

from beanie.operators import In, GTE, LTE, And
from pymongo import ASCENDING, DESCENDING

from app.db.repositories.base import BaseRepository
from app.models.product import Product


_SORT_MAP = {
    "price_asc": [("price", ASCENDING)],
    "price_desc": [("price", DESCENDING)],
    "newest": [("created_at", DESCENDING)],
    "best_selling": [("sold_count", DESCENDING)],
    "relevance": [("created_at", DESCENDING)],  # default
}


class ProductRepository(BaseRepository[Product]):
    def __init__(self) -> None:
        super().__init__(Product)

    async def find_by_slug(self, slug: str) -> Optional[Product]:
        return await Product.find_one(Product.slug == slug, Product.is_active == True)

    async def find_with_filters(
        self,
        *,
        category: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        sizes: list[str] | None = None,
        colors: list[str] | None = None,
        tags: list[str] | None = None,
        sort_by: str = "relevance",
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[Product], int]:
        conditions = [Product.is_active == True]

        if category:
            conditions.append(Product.category == category)
        if min_price is not None:
            conditions.append(Product.price >= min_price)
        if max_price is not None:
            conditions.append(Product.price <= max_price)
        if sizes:
            conditions.append(In(Product.sizes, sizes))
        if colors:
            conditions.append(In(Product.colors, colors))
        if tags:
            conditions.append(In(Product.tags, tags))

        query = Product.find(*conditions)
        total = await query.count()

        sort_spec = _SORT_MAP.get(sort_by, _SORT_MAP["relevance"])
        skip = (page - 1) * page_size

        items = await query.sort(sort_spec).skip(skip).limit(page_size).to_list()
        return items, total

    async def find_all_admin(
        self,
        *,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[Product], int]:
        query = Product.find()
        total = await query.count()
        skip = (page - 1) * page_size
        items = await query.sort([("created_at", DESCENDING)]).skip(skip).limit(page_size).to_list()
        return items, total

    async def find_by_id_active(self, product_id: str) -> Optional[Product]:
        return await Product.get(product_id)

    async def slug_exists(self, slug: str, exclude_id: str | None = None) -> bool:
        query = Product.find_one(Product.slug == slug)
        existing = await query
        if existing is None:
            return False
        if exclude_id and str(existing.id) == exclude_id:
            return False
        return True
