from pydantic import BaseModel, Field


class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(default=1, ge=1, le=99)
    size: str = Field(min_length=1, max_length=20)
    color: str = Field(min_length=1, max_length=50)


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1, le=99)


class GuestCartItem(BaseModel):
    product_id: str
    quantity: int = Field(default=1, ge=1, le=99)
    size: str
    color: str


class CartMergeRequest(BaseModel):
    items: list[GuestCartItem]


class CartItemResponse(BaseModel):
    id: str
    product_id: str
    quantity: int
    size: str
    color: str

    model_config = {"from_attributes": True}
