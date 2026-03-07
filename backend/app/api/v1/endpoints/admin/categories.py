from fastapi import APIRouter, Depends, status

from app.api.deps import get_category_service, require_admin
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.services.category_service import CategoryService

router = APIRouter(prefix="/admin/categories", tags=["Admin - Categories"])


@router.get("", response_model=list[CategoryResponse])
async def admin_list_categories(
    _admin: User = Depends(require_admin),
    service: CategoryService = Depends(get_category_service),
) -> list[CategoryResponse]:
    return await service.list_categories()


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    data: CategoryCreate,
    _admin: User = Depends(require_admin),
    service: CategoryService = Depends(get_category_service),
) -> CategoryResponse:
    return await service.create_category(data)


@router.patch("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    data: CategoryUpdate,
    _admin: User = Depends(require_admin),
    service: CategoryService = Depends(get_category_service),
) -> CategoryResponse:
    return await service.update_category(category_id, data)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: str,
    _admin: User = Depends(require_admin),
    service: CategoryService = Depends(get_category_service),
) -> None:
    await service.delete_category(category_id)
