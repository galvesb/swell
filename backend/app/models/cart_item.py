from datetime import datetime, UTC

from beanie import Document, PydanticObjectId


class CartItem(Document):
    user_id: PydanticObjectId
    product_id: PydanticObjectId
    quantity: int = 1
    size: str
    color: str
    added_at: datetime = None  # type: ignore[assignment]

    def model_post_init(self, __context: object) -> None:
        if self.added_at is None:
            self.added_at = datetime.now(UTC)

    class Settings:
        name = "cart_items"
        indexes = [
            "user_id",
            [
                ("user_id", 1),
                ("product_id", 1),
                ("size", 1),
                ("color", 1),
            ],
        ]
