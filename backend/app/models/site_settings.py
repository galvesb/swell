from typing import Optional

from beanie import Document


class SiteSettings(Document):
    store_name: str = "Swell"
    hero_text: str = "Nova Coleção 2025"
    hero_image: Optional[str] = None
    secondary_color: str = "#A98F81"

    class Settings:
        name = "site_settings"

    @classmethod
    async def get_instance(cls) -> "SiteSettings":
        doc = await cls.find_one()
        if not doc:
            doc = cls()
            await doc.insert()
        return doc
