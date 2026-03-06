import os
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from slugify import slugify
from PIL import Image as PILImage

from app.core.config import settings
from app.db.repositories.product_repo import ProductRepository
from app.models.product import Product, ColorOption
from app.schemas.product import ProductCreate, ProductFilters, ProductListResponse, ProductResponse, ProductUpdate


_ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp"}
_ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp"}


def _to_response(product: Product) -> ProductResponse:
    return ProductResponse(
        id=str(product.id),
        name=product.name,
        slug=product.slug,
        description=product.description,
        category=product.category,
        tags=list(product.tags),
        price=product.price,
        sale_price=product.sale_price,
        stock=product.stock,
        sizes=product.sizes,
        colors=[{"name": c.name, "hex": c.hex} for c in product.colors],
        images=product.images,
        is_active=product.is_active,
        sold_count=product.sold_count,
    )


class ProductService:
    def __init__(self, product_repo: ProductRepository) -> None:
        self._repo = product_repo

    async def list_products_admin(self, page: int, page_size: int) -> ProductListResponse:
        items, total = await self._repo.find_all_admin(page=page, page_size=page_size)
        return ProductListResponse.build(
            items=[_to_response(p) for p in items],
            total=total,
            page=page,
            page_size=page_size,
        )

    async def list_products(self, filters: ProductFilters) -> ProductListResponse:
        items, total = await self._repo.find_with_filters(
            category=filters.category,
            min_price=filters.min_price,
            max_price=filters.max_price,
            sizes=filters.sizes,
            colors=filters.colors,
            tags=[t for t in filters.tags] if filters.tags else None,
            sort_by=filters.sort_by,
            page=filters.page,
            page_size=filters.page_size,
        )
        return ProductListResponse.build(
            items=[_to_response(p) for p in items],
            total=total,
            page=filters.page,
            page_size=filters.page_size,
        )

    async def get_by_slug(self, slug: str) -> ProductResponse:
        product = await self._repo.find_by_slug(slug)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado")
        return _to_response(product)

    async def create_product(self, data: ProductCreate) -> ProductResponse:
        base_slug = slugify(data.name)
        slug = base_slug
        counter = 1
        while await self._repo.slug_exists(slug):
            slug = f"{base_slug}-{counter}"
            counter += 1

        product = Product(
            name=data.name,
            slug=slug,
            description=data.description,
            category=data.category,
            tags=data.tags,
            price=data.price,
            sale_price=data.sale_price,
            stock=data.stock,
            sizes=data.sizes,
            colors=[ColorOption(name=c.name, hex=c.hex) for c in data.colors],
            images=data.images,
        )
        created = await self._repo.create(product)
        return _to_response(created)

    async def update_product(self, product_id: str, data: ProductUpdate) -> ProductResponse:
        product = await self._repo.find_by_id(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado")

        update_dict = data.model_dump(exclude_unset=True)
        if "colors" in update_dict:
            update_dict["colors"] = [ColorOption(name=c["name"], hex=c["hex"]) for c in update_dict["colors"]]

        await product.set(update_dict)
        return _to_response(product)

    async def delete_product(self, product_id: str) -> None:
        product = await self._repo.find_by_id(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado")
        await self._repo.delete(product)

    async def save_images(self, product_id: str, files: list[UploadFile]) -> list[str]:
        product = await self._repo.find_by_id(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado")

        max_bytes = settings.MAX_IMAGE_SIZE_MB * 1024 * 1024
        saved_paths: list[str] = []

        for file in files:
            if file.content_type not in _ALLOWED_MIME:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Tipo não permitido: {file.content_type}. Use JPEG, PNG ou WEBP.",
                )
            ext = Path(file.filename or "image.jpg").suffix.lower()
            if ext not in _ALLOWED_EXT:
                ext = ".jpg"

            content = await file.read()
            if len(content) > max_bytes:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"Imagem excede {settings.MAX_IMAGE_SIZE_MB}MB",
                )

            filename = f"{uuid.uuid4().hex}{ext}"
            dest = Path(settings.UPLOAD_DIR) / filename
            dest.write_bytes(content)

            # Validate it's a real image
            try:
                img = PILImage.open(dest)
                img.verify()
            except Exception:
                dest.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Arquivo de imagem inválido",
                )

            saved_paths.append(f"/uploads/{filename}")

        new_images = product.images + saved_paths
        await product.set({Product.images: new_images})
        return new_images

    async def delete_image(self, product_id: str, filename: str) -> None:
        product = await self._repo.find_by_id(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado")

        url = f"/uploads/{filename}"
        if url not in product.images:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Imagem não encontrada")

        filepath = Path(settings.UPLOAD_DIR) / filename
        filepath.unlink(missing_ok=True)

        new_images = [img for img in product.images if img != url]
        await product.set({Product.images: new_images})
