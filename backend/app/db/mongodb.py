from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.core.config import settings


async def init_db() -> AsyncIOMotorClient:
    from app.models.user import User
    from app.models.product import Product
    from app.models.cart_item import CartItem
    from app.models.category import Category
    from app.models.site_settings import SiteSettings

    client: AsyncIOMotorClient = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[User, Product, CartItem, Category, SiteSettings])
    return client
