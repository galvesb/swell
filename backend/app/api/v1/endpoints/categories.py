from fastapi import APIRouter
from pydantic import BaseModel

from app.models.category import Category

router = APIRouter(prefix="/categories", tags=["Categories"])


class CategoryResponse(BaseModel):
    id: str
    slug: str
    name: str
    description: str
    order: int


@router.get("", response_model=list[CategoryResponse])
async def list_categories() -> list[CategoryResponse]:
    categories = await Category.find_all().sort(Category.order).to_list()
    return [
        CategoryResponse(
            id=str(c.id),
            slug=c.slug,
            name=c.name,
            description=c.description,
            order=c.order,
        )
        for c in categories
    ]
