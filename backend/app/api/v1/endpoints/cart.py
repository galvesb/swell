from fastapi import APIRouter, Depends, status

from app.api.deps import get_cart_service, get_current_user
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemResponse, CartMergeRequest
from app.services.cart_service import CartService

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("", response_model=list[CartItemResponse])
async def get_cart(
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(get_cart_service),
) -> list[CartItemResponse]:
    return await service.get_cart(str(current_user.id))


@router.post("/items", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
async def add_item(
    data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(get_cart_service),
) -> CartItemResponse:
    return await service.add_item(str(current_user.id), data)


@router.patch("/items/{item_id}", response_model=CartItemResponse)
async def update_item(
    item_id: str,
    data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(get_cart_service),
) -> CartItemResponse:
    return await service.update_item(str(current_user.id), item_id, data)


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_item(
    item_id: str,
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(get_cart_service),
) -> None:
    await service.remove_item(str(current_user.id), item_id)


@router.post("/merge", response_model=list[CartItemResponse])
async def merge_cart(
    data: CartMergeRequest,
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(get_cart_service),
) -> list[CartItemResponse]:
    return await service.merge_guest_cart(str(current_user.id), data)
