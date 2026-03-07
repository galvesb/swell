from typing import Optional

from pymongo import ASCENDING

from app.db.repositories.base import BaseRepository
from app.models.category import Category


class CategoryRepository(BaseRepository[Category]):
    def __init__(self) -> None:
        super().__init__(Category)

    async def find_by_slug(self, slug: str) -> Optional[Category]:
        return await Category.find_one(Category.slug == slug)

    async def find_all_ordered(self) -> list[Category]:
        return await Category.find_all().sort([("order", ASCENDING)]).to_list()

    async def slug_exists(self, slug: str, exclude_id: str | None = None) -> bool:
        existing = await Category.find_one(Category.slug == slug)
        if existing is None:
            return False
        if exclude_id and str(existing.id) == exclude_id:
            return False
        return True

    async def count(self) -> int:
        return await Category.find_all().count()
