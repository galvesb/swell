from fastapi import APIRouter, Depends

from app.api.deps import get_category_service
from app.schemas.category import CategoryResponse
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=list[CategoryResponse])
async def list_categories(
    service: CategoryService = Depends(get_category_service),
) -> list[CategoryResponse]:
    return await service.list_categories()
