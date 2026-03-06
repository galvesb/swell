from typing import Optional

from pydantic import BaseModel


class SettingsUpdate(BaseModel):
    store_name: Optional[str] = None
    hero_text: Optional[str] = None
    secondary_color: Optional[str] = None


class SettingsResponse(BaseModel):
    store_name: str
    hero_text: str
    hero_image: Optional[str]
    secondary_color: str
