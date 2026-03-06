from fastapi import APIRouter, Depends, File, UploadFile, status
from pydantic import BaseModel

from app.api.deps import get_product_service, require_admin
from app.models.user import User
from app.schemas.product import ProductCreate, ProductListResponse, ProductResponse, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter(prefix="/admin/products", tags=["Admin - Products"])


class ImagesResponse(BaseModel):
    images: list[str]


class DeleteImageRequest(BaseModel):
    filename: str


@router.get("", response_model=ProductListResponse)
async def admin_list_products(
    page: int = 1,
    page_size: int = 20,
    _admin: User = Depends(require_admin),
    service: ProductService = Depends(get_product_service),
) -> ProductListResponse:
    return await service.list_products_admin(page, page_size)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    data: ProductCreate,
    _admin: User = Depends(require_admin),
    service: ProductService = Depends(get_product_service),
) -> ProductResponse:
    return await service.create_product(data)


@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    data: ProductUpdate,
    _admin: User = Depends(require_admin),
    service: ProductService = Depends(get_product_service),
) -> ProductResponse:
    return await service.update_product(product_id, data)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    _admin: User = Depends(require_admin),
    service: ProductService = Depends(get_product_service),
) -> None:
    await service.delete_product(product_id)


@router.post("/{product_id}/images", response_model=ImagesResponse)
async def upload_images(
    product_id: str,
    files: list[UploadFile] = File(...),
    _admin: User = Depends(require_admin),
    service: ProductService = Depends(get_product_service),
) -> ImagesResponse:
    images = await service.save_images(product_id, files)
    return ImagesResponse(images=images)


@router.delete("/{product_id}/images", status_code=status.HTTP_204_NO_CONTENT)
async def delete_image(
    product_id: str,
    data: DeleteImageRequest,
    _admin: User = Depends(require_admin),
    service: ProductService = Depends(get_product_service),
) -> None:
    await service.delete_image(product_id, data.filename)
