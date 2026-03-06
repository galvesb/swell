from beanie import Document, Indexed


class Category(Document):
    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    name: str
    description: str = ""
    order: int = 0

    class Settings:
        name = "categories"
