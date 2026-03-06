from beanie import PydanticObjectId

from app.db.repositories.base import BaseRepository
from app.models.cart_item import CartItem


class CartRepository(BaseRepository[CartItem]):
    def __init__(self) -> None:
        super().__init__(CartItem)

    async def get_user_cart(self, user_id: str) -> list[CartItem]:
        return await CartItem.find(CartItem.user_id == PydanticObjectId(user_id)).to_list()

    async def find_item(self, user_id: str, product_id: str, size: str, color: str) -> CartItem | None:
        return await CartItem.find_one(
            CartItem.user_id == PydanticObjectId(user_id),
            CartItem.product_id == PydanticObjectId(product_id),
            CartItem.size == size,
            CartItem.color == color,
        )

    async def upsert_item(
        self,
        user_id: str,
        product_id: str,
        quantity: int,
        size: str,
        color: str,
    ) -> CartItem:
        existing = await self.find_item(user_id, product_id, size, color)
        if existing:
            await existing.set({CartItem.quantity: existing.quantity + quantity})
            return existing
        item = CartItem(
            user_id=PydanticObjectId(user_id),
            product_id=PydanticObjectId(product_id),
            quantity=quantity,
            size=size,
            color=color,
        )
        return await item.insert()

    async def update_quantity(self, item: CartItem, quantity: int) -> CartItem:
        await item.set({CartItem.quantity: quantity})
        return item

    async def delete_item(self, item: CartItem) -> None:
        await item.delete()

    async def merge_guest_cart(
        self,
        user_id: str,
        guest_items: list[dict],
    ) -> list[CartItem]:
        for guest in guest_items:
            await self.upsert_item(
                user_id=user_id,
                product_id=guest["product_id"],
                quantity=guest["quantity"],
                size=guest["size"],
                color=guest["color"],
            )
        return await self.get_user_cart(user_id)
