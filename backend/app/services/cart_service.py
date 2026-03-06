from fastapi import HTTPException, status

from app.db.repositories.cart_repo import CartRepository
from app.models.cart_item import CartItem
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemResponse, CartMergeRequest


def _to_response(item: CartItem) -> CartItemResponse:
    return CartItemResponse(
        id=str(item.id),
        product_id=str(item.product_id),
        quantity=item.quantity,
        size=item.size,
        color=item.color,
    )


class CartService:
    def __init__(self, cart_repo: CartRepository) -> None:
        self._repo = cart_repo

    async def get_cart(self, user_id: str) -> list[CartItemResponse]:
        items = await self._repo.get_user_cart(user_id)
        return [_to_response(i) for i in items]

    async def add_item(self, user_id: str, data: CartItemCreate) -> CartItemResponse:
        item = await self._repo.upsert_item(
            user_id=user_id,
            product_id=data.product_id,
            quantity=data.quantity,
            size=data.size,
            color=data.color,
        )
        return _to_response(item)

    async def update_item(self, user_id: str, item_id: str, data: CartItemUpdate) -> CartItemResponse:
        item = await CartItem.get(item_id)
        if not item or str(item.user_id) != user_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")
        updated = await self._repo.update_quantity(item, data.quantity)
        return _to_response(updated)

    async def remove_item(self, user_id: str, item_id: str) -> None:
        item = await CartItem.get(item_id)
        if not item or str(item.user_id) != user_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")
        await self._repo.delete_item(item)

    async def merge_guest_cart(self, user_id: str, req: CartMergeRequest) -> list[CartItemResponse]:
        guest_items = [i.model_dump() for i in req.items]
        items = await self._repo.merge_guest_cart(user_id, guest_items)
        return [_to_response(i) for i in items]
