from fastapi import HTTPException, status
from slugify import slugify

from app.db.repositories.category_repo import CategoryRepository
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate


def _to_response(cat: Category) -> CategoryResponse:
    return CategoryResponse(
        id=str(cat.id),
        slug=cat.slug,
        name=cat.name,
        description=cat.description,
        order=cat.order,
    )


class CategoryService:
    def __init__(self, repo: CategoryRepository) -> None:
        self._repo = repo

    async def list_categories(self) -> list[CategoryResponse]:
        cats = await self._repo.find_all_ordered()
        return [_to_response(c) for c in cats]

    async def create_category(self, data: CategoryCreate) -> CategoryResponse:
        base_slug = slugify(data.name)
        slug = base_slug
        counter = 1
        while await self._repo.slug_exists(slug):
            slug = f"{base_slug}-{counter}"
            counter += 1

        next_order = await self._repo.count()

        cat = Category(
            slug=slug,
            name=data.name,
            description=data.description,
            order=next_order,
        )
        created = await self._repo.create(cat)
        return _to_response(created)

    async def update_category(self, category_id: str, data: CategoryUpdate) -> CategoryResponse:
        cat = await self._repo.find_by_id(category_id)
        if not cat:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoria nao encontrada")

        update_dict = data.model_dump(exclude_unset=True)

        if "name" in update_dict:
            new_slug = slugify(update_dict["name"])
            if new_slug != cat.slug and await self._repo.slug_exists(new_slug, exclude_id=category_id):
                counter = 1
                base = new_slug
                while await self._repo.slug_exists(new_slug, exclude_id=category_id):
                    new_slug = f"{base}-{counter}"
                    counter += 1
            update_dict["slug"] = new_slug

        await cat.set(update_dict)
        return _to_response(cat)

    async def delete_category(self, category_id: str) -> None:
        cat = await self._repo.find_by_id(category_id)
        if not cat:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoria nao encontrada")
        await self._repo.delete(cat)
