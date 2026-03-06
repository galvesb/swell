from fastapi import HTTPException, status

from app.core.security import hash_password, verify_password, decode_token, create_access_token
from app.db.repositories.user_repo import UserRepository
from app.models.user import User
from app.schemas.user import UserCreate


class AuthService:
    def __init__(self, user_repo: UserRepository) -> None:
        self._repo = user_repo

    async def authenticate(self, email: str, password: str) -> User:
        user = await self._repo.find_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciais inválidas",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Conta inativa",
            )
        return user

    async def register(self, data: UserCreate) -> User:
        if await self._repo.email_exists(data.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="E-mail já cadastrado",
            )
        user = User(
            email=data.email,
            hashed_password=hash_password(data.password),
            full_name=data.full_name,
        )
        return await self._repo.create(user)

    async def refresh_access_token(self, refresh_token: str) -> str:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token inválido ou expirado",
            )
        user_id: str = payload.get("sub", "")
        user = await self._repo.find_by_id(user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário não encontrado",
            )
        return create_access_token(user_id)
