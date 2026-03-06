import re
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)
    full_name: str = Field(min_length=2, max_length=100)

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        errors: list[str] = []
        if not re.search(r"[A-Z]", v):
            errors.append("pelo menos uma letra maiúscula")
        if not re.search(r"\d", v):
            errors.append("pelo menos um número")
        if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", v):
            errors.append("pelo menos um caractere especial")
        if errors:
            raise ValueError(f"Senha deve conter: {', '.join(errors)}")
        return v


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: Literal["customer", "admin"]
    is_active: bool

    model_config = {"from_attributes": True}
