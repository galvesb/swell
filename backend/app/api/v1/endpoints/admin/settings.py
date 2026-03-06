from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.api.deps import require_admin
from app.models.user import User
from app.schemas.settings import SettingsResponse, SettingsUpdate
from app.services import settings_service

router = APIRouter(tags=["Settings"])


@router.get("/settings", response_model=SettingsResponse)
async def get_settings() -> SettingsResponse:
    return await settings_service.get_settings()


@router.put("/settings", response_model=SettingsResponse)
async def update_settings(
    store_name: Optional[str] = Form(None),
    hero_text: Optional[str] = Form(None),
    secondary_color: Optional[str] = Form(None),
    hero_image: Optional[UploadFile] = File(None),
    _admin: User = Depends(require_admin),
) -> SettingsResponse:
    data = SettingsUpdate(
        store_name=store_name,
        hero_text=hero_text,
        secondary_color=secondary_color,
    )
    return await settings_service.update_settings(data, hero_image)
