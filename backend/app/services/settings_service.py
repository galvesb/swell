import uuid
from pathlib import Path
from typing import Optional

from fastapi import HTTPException, UploadFile, status
from PIL import Image as PILImage

from app.core.config import settings
from app.models.site_settings import SiteSettings
from app.schemas.settings import SettingsResponse, SettingsUpdate

_ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp"}
_ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp"}

_cache: Optional[SiteSettings] = None


def _to_response(doc: SiteSettings) -> SettingsResponse:
    return SettingsResponse(
        store_name=doc.store_name,
        hero_text=doc.hero_text,
        hero_image=doc.hero_image,
        secondary_color=doc.secondary_color,
    )


async def get_settings() -> SettingsResponse:
    global _cache
    if _cache is None:
        _cache = await SiteSettings.get_instance()
    return _to_response(_cache)


async def update_settings(
    data: SettingsUpdate,
    hero_file: Optional[UploadFile] = None,
) -> SettingsResponse:
    global _cache
    doc = await SiteSettings.get_instance()

    if data.store_name is not None:
        doc.store_name = data.store_name
    if data.hero_text is not None:
        doc.hero_text = data.hero_text
    if data.secondary_color is not None:
        doc.secondary_color = data.secondary_color

    if hero_file is not None:
        if hero_file.content_type not in _ALLOWED_MIME:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Tipo não permitido: {hero_file.content_type}. Use JPEG, PNG ou WEBP.",
            )
        ext = Path(hero_file.filename or "hero.jpg").suffix.lower()
        if ext not in _ALLOWED_EXT:
            ext = ".jpg"

        content = await hero_file.read()

        filename = f"hero-{uuid.uuid4().hex}{ext}"
        dest = Path(settings.UPLOAD_DIR) / filename
        dest.write_bytes(content)

        try:
            img = PILImage.open(dest)
            img.verify()
        except Exception:
            dest.unlink(missing_ok=True)
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Arquivo de imagem inválido",
            )

        # Delete old hero image if it was a local upload
        if doc.hero_image and doc.hero_image.startswith("/uploads/hero-"):
            old_filename = doc.hero_image.split("/")[-1]
            old_path = Path(settings.UPLOAD_DIR) / old_filename
            old_path.unlink(missing_ok=True)

        doc.hero_image = f"/uploads/{filename}"

    await doc.save()
    _cache = doc
    return _to_response(doc)
