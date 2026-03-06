from typing import Optional

from app.db.repositories.base import BaseRepository
from app.models.user import User


class UserRepository(BaseRepository[User]):
    def __init__(self) -> None:
        super().__init__(User)

    async def find_by_email(self, email: str) -> Optional[User]:
        return await User.find_one(User.email == email)

    async def create(self, doc: User) -> User:
        return await doc.insert()

    async def email_exists(self, email: str) -> bool:
        return await User.find_one(User.email == email) is not None
