from datetime import datetime, UTC
from typing import Literal

from beanie import Document, Indexed
from pydantic import EmailStr


class User(Document):
    email: Indexed(EmailStr, unique=True)  # type: ignore[valid-type]
    hashed_password: str
    full_name: str
    role: Literal["customer", "admin"] = "customer"
    is_active: bool = True
    created_at: datetime = None  # type: ignore[assignment]

    def model_post_init(self, __context: object) -> None:
        if self.created_at is None:
            self.created_at = datetime.now(UTC)

    class Settings:
        name = "users"
