from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str = ""


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = None
    order: int | None = Field(default=None, ge=0)


class CategoryResponse(BaseModel):
    id: str
    slug: str
    name: str
    description: str
    order: int

    model_config = {"from_attributes": True}
