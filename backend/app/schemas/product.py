from math import ceil
from typing import Literal

from pydantic import BaseModel, Field


class ColorOptionSchema(BaseModel):
    name: str
    hex: str


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    description: str = ""
    category: str = Field(min_length=2, max_length=100)
    tags: list[Literal["new_in", "best_seller", "last_pieces", "sale"]] = []
    price: float = Field(gt=0)
    sale_price: float | None = Field(default=None, gt=0)
    stock: int = Field(default=0, ge=0)
    sizes: list[str] = []
    colors: list[ColorOptionSchema] = []
    images: list[str] = []


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    description: str | None = None
    category: str | None = Field(default=None, min_length=2, max_length=100)
    tags: list[Literal["new_in", "best_seller", "last_pieces", "sale"]] | None = None
    price: float | None = Field(default=None, gt=0)
    sale_price: float | None = Field(default=None, gt=0)
    stock: int | None = Field(default=None, ge=0)
    sizes: list[str] | None = None
    colors: list[ColorOptionSchema] | None = None
    images: list[str] | None = None
    is_active: bool | None = None


class ProductResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    category: str
    tags: list[str]
    price: float
    sale_price: float | None
    stock: int
    sizes: list[str]
    colors: list[ColorOptionSchema]
    images: list[str]
    is_active: bool
    sold_count: int

    model_config = {"from_attributes": True}


class ProductFilters(BaseModel):
    category: str | None = None
    min_price: float | None = Field(default=None, ge=0)
    max_price: float | None = Field(default=None, ge=0)
    sizes: list[str] | None = None
    colors: list[str] | None = None
    tags: list[Literal["new_in", "best_seller", "last_pieces", "sale"]] | None = None
    sort_by: Literal["relevance", "price_asc", "price_desc", "newest", "best_selling"] = "relevance"
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int
    pages: int

    @classmethod
    def build(cls, items: list[ProductResponse], total: int, page: int, page_size: int) -> "ProductListResponse":
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            pages=ceil(total / page_size) if page_size > 0 else 0,
        )
