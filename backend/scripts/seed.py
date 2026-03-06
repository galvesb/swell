"""
Seed script: populate MongoDB with initial data.
Run: python -m scripts.seed
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.db.mongodb import init_db
from app.core.security import hash_password
from app.models.user import User
from app.models.category import Category
from app.models.product import Product, ColorOption
from app.models.site_settings import SiteSettings


CATEGORIES = [
    {"slug": "new-in", "name": "New In", "description": "Novidades da semana", "order": 0},
    {"slug": "ocasioes", "name": "Ocasiões", "description": "Looks para cada momento", "order": 1},
    {"slug": "colecoes", "name": "Coleções", "description": "Nossas coleções exclusivas", "order": 2},
    {"slug": "best-sellers", "name": "Best Sellers", "description": "Os mais amados", "order": 3},
    {"slug": "roupas", "name": "Roupas", "description": "Linha completa de roupas", "order": 4},
    {"slug": "ultimas-pecas", "name": "Últimas Peças", "description": "Corra, estoque limitado!", "order": 5},
    {"slug": "sale", "name": "Sale", "description": "Promoções imperdíveis", "order": 6},
    {"slug": "alfaiataria", "name": "Alfaiataria", "description": "Elegância e precisão", "order": 7},
]

PRODUCTS = [
    {
        "name": "Blazer Alfaiataria Preto",
        "slug": "blazer-alfaiataria-preto",
        "description": "Blazer de alfaiataria com caimento perfeito para todas as ocasiões.",
        "category": "alfaiataria",
        "tags": ["novos", "mais_vendidos", "principal"],
        "price": 599.90,
        "sale_price": None,
        "stock": 15,
        "sizes": ["PP", "P", "M", "G", "GG"],
        "colors": [{"name": "Preto", "hex": "#1a1a1a"}],
        "images": [
            "https://images.unsplash.com/photo-1550614000-4b95d4edfa21?auto=format&fit=crop&w=500&q=80"
        ],
    },
    {
        "name": "Macacão Chiara",
        "slug": "macacao-chiara",
        "description": "Macacão elegante com tecido premium e acabamento impecável.",
        "category": "roupas",
        "tags": ["mais_vendidos", "principal"],
        "price": 419.90,
        "sale_price": None,
        "stock": 8,
        "sizes": ["XPP", "PP", "P", "M"],
        "colors": [
            {"name": "Preto", "hex": "#1a1a1a"},
            {"name": "Bege", "hex": "#D4B896"},
        ],
        "images": [
            "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=500&q=80"
        ],
    },
    {
        "name": "Vestido Midi Florido",
        "slug": "vestido-midi-florido",
        "description": "Vestido midi com estampa floral e tecido fluido.",
        "category": "ocasioes",
        "tags": ["novos", "principal"],
        "price": 349.90,
        "sale_price": 279.90,
        "stock": 3,
        "sizes": ["P", "M", "G"],
        "colors": [{"name": "Floral", "hex": "#E8B4B8"}],
        "images": [
            "https://images.unsplash.com/photo-1515347619362-7dd3e215442e?auto=format&fit=crop&w=500&q=80"
        ],
    },
    {
        "name": "Calça Wide Leg Branca",
        "slug": "calca-wide-leg-branca",
        "description": "Calça wide leg em tecido de alfaiataria. Última peça!",
        "category": "alfaiataria",
        "tags": ["ultimas_pecas", "promocoes"],
        "price": 289.90,
        "sale_price": 199.90,
        "stock": 2,
        "sizes": ["P", "M"],
        "colors": [{"name": "Branco", "hex": "#f5f5f5"}],
        "images": [
            "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=500&q=80"
        ],
    },
]


async def main() -> None:
    client = await init_db()
    print("Connected to MongoDB")

    # Admin user
    existing_admin = await User.find_one(User.email == "admin@swell.com")
    if not existing_admin:
        admin = User(
            email="admin@swell.com",
            hashed_password=hash_password("Admin@123"),
            full_name="Swell Admin",
            role="admin",
        )
        await admin.insert()
        print("✓ Admin user created: admin@swell.com / Admin@123")
    else:
        print("  Admin user already exists")

    # Categories — limpa e recria
    await Category.find_all().delete()
    print("✓ Categories cleared")
    for cat_data in CATEGORIES:
        cat = Category(**cat_data)
        await cat.insert()
        print(f"✓ Category: {cat_data['name']}")

    # Products — limpa e recria
    await Product.find_all().delete()
    print("✓ Products cleared")
    for prod_data in PRODUCTS:
        data = {**prod_data}
        colors = [ColorOption(**c) for c in data.pop("colors")]
        product = Product(**data, colors=colors)
        await product.insert()
        print(f"✓ Product: {product.name}")

    # SiteSettings singleton
    existing_settings = await SiteSettings.find_one()
    if not existing_settings:
        site = SiteSettings()
        await site.insert()
        print("✓ SiteSettings padrão criado")
    else:
        print("  SiteSettings já existe")

    print("\nSeed complete!")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
