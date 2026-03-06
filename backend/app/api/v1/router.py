from fastapi import APIRouter

from app.api.v1.endpoints import auth, products, categories, cart
from app.api.v1.endpoints.admin import products as admin_products
from app.api.v1.endpoints.admin import settings as admin_settings

router = APIRouter()

router.include_router(auth.router)
router.include_router(products.router)
router.include_router(categories.router)
router.include_router(cart.router)
router.include_router(admin_products.router)
router.include_router(admin_settings.router)
