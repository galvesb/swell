# Design: Admin Site Settings

## Arquitetura geral

```
┌─────────────────────────────────────────────────────────┐
│ App.tsx mount                                           │
│   └─ settingsStore.init() → GET /api/v1/settings        │
│         ├─ document.title = store_name                  │
│         ├─ CSS var(--swell-accent) = secondary_color    │
│         ├─ Header: store_name dinâmico                  │
│         └─ HomePage Hero: hero_text + hero_image        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Admin Panel (/admin/*)                                  │
│                                                         │
│  AdminLayout                                            │
│  ├─ Sidebar: [Produtos] [Editar Site]                   │
│  ├─ /admin → AdminDashboard (produtos)                  │
│  └─ /admin/site → SiteSettingsPage                      │
└─────────────────────────────────────────────────────────┘
```

---

## Backend

### Model: SiteSettings

```python
# app/models/site_settings.py
from enum import Enum
from typing import Optional
from beanie import Document

class SecondaryColor(str, Enum):
    original = "#A98F81"
    green    = "#187f0f"

class SiteSettings(Document):
    store_name: str = "Swell"
    hero_text: str  = "Nova Coleção 2025"
    hero_image: Optional[str] = None          # path relativo: /uploads/hero-xxx.jpg
    secondary_color: SecondaryColor = SecondaryColor.original

    class Settings:
        name = "site_settings"

    @classmethod
    async def get_instance(cls) -> "SiteSettings":
        doc = await cls.find_one()
        if not doc:
            doc = cls()
            await doc.insert()
        return doc
```

Padrão Singleton: `find_one()` garante que só existe um documento. O `PUT /settings` faz `replace_one` sem criar duplicata.

### Cache in-process

```python
# app/services/settings_service.py
_cache: Optional[SiteSettings] = None

async def get_settings() -> SiteSettings:
    global _cache
    if _cache is None:
        _cache = await SiteSettings.get_instance()
    return _cache

async def update_settings(data: SettingsUpdate, hero_file=None) -> SiteSettings:
    global _cache
    doc = await SiteSettings.get_instance()
    # aplicar campos
    # salvar imagem hero se enviada
    await doc.save()
    _cache = doc          # invalida e atualiza cache
    return doc
```

TTL não é necessário para MVP. O cache é invalidado sempre que `PUT /settings` for chamado.

### Rotas

```
GET  /api/v1/settings          → público, retorna SiteSettingsResponse
PUT  /api/v1/settings          → admin only, multipart/form-data
     - store_name (str, opcional)
     - hero_text  (str, opcional)
     - hero_image (UploadFile, opcional)
     - secondary_color (enum, opcional)
```

`PUT` usa `multipart/form-data` para combinar campos de texto e upload de imagem em uma única requisição (consistente com o upload de imagens de produto já existente).

### Registro no init_beanie

`app/db/mongodb.py` — adicionar `SiteSettings` à lista de `document_models`.

---

## Frontend

### settingsStore (Zustand)

```ts
// src/store/settingsStore.ts
interface SiteSettings {
  store_name: string
  hero_text: string
  hero_image: string | null
  secondary_color: '#A98F81' | '#187f0f'
}

interface SettingsStore {
  settings: SiteSettings | null
  init: () => Promise<void>
  update: (data: Partial<SiteSettings>) => void   // otimista, pós-PUT
}
```

`init()` é chamado em `App.tsx` via `useEffect([], ...)` — uma vez no mount. Sem `persist` (dados sempre frescos do server no reload).

### Injeção de CSS custom properties

```ts
// dentro de settingsStore.init()
const accentMap: Record<string, string> = {
  '#A98F81': { accent: '#A98F81', hover: '#91776b' },
  '#187f0f': { accent: '#187f0f', hover: '#126b09' },
}
const colors = accentMap[settings.secondary_color]
document.documentElement.style.setProperty('--swell-accent', colors.accent)
document.documentElement.style.setProperty('--swell-accent-hover', colors.hover)
```

### tailwind.config.ts — migração para CSS vars

```ts
colors: {
  swell: {
    accent:        'var(--swell-accent)',
    'accent-hover':'var(--swell-accent-hover)',
    // demais tokens permanecem iguais
  }
}
```

```css
/* index.css — valores default (SSR/flash prevention) */
:root {
  --swell-accent:       #A98F81;
  --swell-accent-hover: #91776b;
}
```

Isso garante que antes do fetch de settings, a cor original já está aplicada (sem flash de cor errada).

### AdminLayout

```
src/components/admin/AdminLayout.tsx
├─ Header simplificado: LogoSvg + "Painel Admin" (mesma tipografia)
└─ Sidebar:
   ├─ Link "Produtos"    → /admin
   └─ Link "Editar Site" → /admin/site
   (link ativo: bg-swell-bg + borda esquerda swell-accent)
```

Reutiliza `LogoSvg`, fontes Montserrat/Playfair Display, `swell-border`, `swell-accent`.

### SiteSettingsPage

```
src/pages/admin/SiteSettingsPage.tsx
├─ Campo: Nome da Loja (input text)
├─ Campo: Texto do Hero (input text)
├─ Campo: Imagem do Hero (ImageUpload — reutiliza componente existente)
└─ Campo: Cor Secundária
   ├─ Swatch 1: #A98F81 (Original)  ← círculo com borda se selecionado
   └─ Swatch 2: #187f0f (Verde)     ← círculo com borda se selecionado
```

Submit: `PUT /api/v1/settings` como `multipart/form-data`. Após sucesso, chama `settingsStore.update()` para atualizar globalmente sem reload.

### Modificações em componentes existentes

**Header.tsx:**
```ts
const { settings } = useSettingsStore()
// <span>{settings?.store_name ?? 'Swell'}</span>
// document.title já é setado no init(), mas Header pode reforçar
```

**HomePage.tsx:**
```ts
const { settings } = useSettingsStore()
// <h1>{settings?.hero_text ?? 'Nova Coleção 2025'}</h1>
// <img src={settings?.hero_image ?? '/images/hero-default.jpg'} />
```

**App.tsx:**
```ts
const init = useSettingsStore(s => s.init)
useEffect(() => { init() }, [])
```

---

## Rotas admin atualizadas

```
/admin        → AdminLayout > AdminDashboard    (produtos)
/admin/site   → AdminLayout > SiteSettingsPage (editar site)
/admin/produtos/:id → AdminLayout > AdminProductForm
```

Todos protegidos por `AdminRoute`.

---

## Fluxo de dados — Editar Site

```
SiteSettingsPage
  └─ formulário preenchido com settingsStore.settings
  └─ usuário altera campo / seleciona swatch
  └─ submit → PUT /api/v1/settings (multipart)
        └─ backend salva no Mongo + invalida _cache
        └─ retorna SiteSettingsResponse atualizado
  └─ frontend: settingsStore.update(response)
        ├─ atualiza store
        └─ reinjeta CSS vars se cor mudou
```

---

## Arquivos novos

| Caminho | Descrição |
|---|---|
| `backend/app/models/site_settings.py` | Beanie Document Singleton |
| `backend/app/schemas/settings.py` | Pydantic SettingsUpdate + SettingsResponse |
| `backend/app/services/settings_service.py` | get_settings, update_settings, cache |
| `backend/app/api/v1/endpoints/admin/settings.py` | Rotas GET + PUT |
| `frontend/src/store/settingsStore.ts` | Zustand store global |
| `frontend/src/api/settings.ts` | axios calls |
| `frontend/src/types/settings.ts` | TypeScript types |
| `frontend/src/components/admin/AdminLayout.tsx` | Layout com sidebar |
| `frontend/src/pages/admin/SiteSettingsPage.tsx` | Formulário "Editar Site" |

## Arquivos modificados

| Caminho | Mudança |
|---|---|
| `backend/app/db/mongodb.py` | + SiteSettings em init_beanie |
| `backend/app/api/v1/router.py` | + settings router |
| `backend/scripts/seed.py` | + inserir SiteSettings padrão |
| `frontend/src/App.tsx` | + init settingsStore + rotas /admin/site |
| `frontend/src/index.css` | + CSS vars em :root |
| `frontend/tailwind.config.ts` | accent → var(--swell-accent) |
| `frontend/src/components/layout/Header.tsx` | nome dinâmico |
| `frontend/src/pages/HomePage.tsx` | hero dinâmico |
