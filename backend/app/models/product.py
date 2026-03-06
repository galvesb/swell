from datetime import datetime, UTC
from typing import Literal

from beanie import Document, Indexed
from pydantic import BaseModel


class ColorOption(BaseModel):
    name: str
    hex: str


class Product(Document):
    name: str
    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    description: str = ""
    category: Indexed(str)  # type: ignore[valid-type]
    tags: list[Literal["novos", "mais_vendidos", "ultimas_pecas", "promocoes", "principal"]] = []
    price: float
    sale_price: float | None = None
    stock: int = 0
    sizes: list[str] = []
    colors: list[ColorOption] = []
    images: list[str] = []
    is_active: bool = True
    sold_count: int = 0
    created_at: datetime = None  # type: ignore[assignment]

    def model_post_init(self, __context: object) -> None:
        if self.created_at is None:
            self.created_at = datetime.now(UTC)

    class Settings:
        name = "products"
        indexes = [
            "category",
            "tags",
            "price",
            "is_active",
            "created_at",
        ]
