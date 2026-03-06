# Tasks: Admin Site Settings

## Passo 1 — Backend: Model e Schema

- [x] Criar `backend/app/models/site_settings.py`
  - Enum `SecondaryColor` com valores `#A98F81` e `#187f0f`
  - Beanie Document `SiteSettings` com campos: `store_name`, `hero_text`, `hero_image`, `secondary_color`
  - Método de classe `get_instance()` (find_one ou insert)
- [x] Criar `backend/app/schemas/settings.py`
  - `SettingsUpdate` (todos os campos opcionais, secondary_color usa enum)
  - `SettingsResponse` (todos os campos obrigatórios com defaults)
- [x] Adicionar `SiteSettings` em `backend/app/db/mongodb.py` → lista `document_models` do `init_beanie`

---

## Passo 2 — Backend: Service e Cache

- [x] Criar `backend/app/services/settings_service.py`
  - Variável de módulo `_cache: Optional[SiteSettings] = None`
  - `async def get_settings() -> SiteSettings` — retorna cache ou busca do Mongo
  - `async def update_settings(data: SettingsUpdate, hero_file: Optional[UploadFile]) -> SiteSettings`
    - Atualiza apenas campos presentes em `data`
    - Salva imagem hero em `/app/uploads/hero-<uuid>.jpg` se `hero_file` fornecido
    - Deleta imagem antiga se existia
    - Chama `await doc.save()` e invalida `_cache`

---

## Passo 3 — Backend: Router

- [x] Criar `backend/app/api/v1/endpoints/admin/settings.py`
  - `GET /api/v1/settings` — público, chama `get_settings()`, retorna `SettingsResponse`
  - `PUT /api/v1/settings` — depende de `require_admin`, aceita `multipart/form-data`, chama `update_settings()`
- [x] Registrar router em `backend/app/api/v1/router.py`

---

## Passo 4 — Backend: Seed

- [x] Atualizar `backend/scripts/seed.py` — inserir documento `SiteSettings` padrão se não existir
  - `store_name="Swell"`, `hero_text="Nova Coleção 2025"`, `hero_image=None`, `secondary_color="#A98F81"`

---

## Passo 5 — Frontend: Infraestrutura de Tema

- [x] Atualizar `frontend/src/index.css`
  - Adicionar em `:root`: `--swell-accent: #A98F81;` e `--swell-accent-hover: #91776b;`
- [x] Atualizar `frontend/tailwind.config.ts`
  - `accent: 'var(--swell-accent)'`
  - `'accent-hover': 'var(--swell-accent-hover)'`

---

## Passo 6 — Frontend: settingsStore e API

- [x] Criar `frontend/src/types/settings.ts`
  - Interface `SiteSettings` com campos tipados
  - Type `SecondaryColor = '#A98F81' | '#187f0f'`
- [x] Criar `frontend/src/api/settings.ts`
  - `getSettings(): Promise<SiteSettings>`
  - `updateSettings(data: FormData): Promise<SiteSettings>` — POST multipart
- [x] Criar `frontend/src/store/settingsStore.ts`
  - Estado: `settings: SiteSettings | null`
  - Ação `init()`: fetch + injeção de CSS vars (`--swell-accent`, `--swell-accent-hover`) + `document.title`
  - Ação `update(data)`: atualiza store + reinjecta CSS vars se cor mudou

---

## Passo 7 — Frontend: App.tsx e Rotas

- [x] Atualizar `frontend/src/App.tsx`
  - Chamar `settingsStore.init()` no `useEffect([], ...)`
  - Adicionar rota `GET /admin/site` → `<AdminRoute><AdminLayout><SiteSettingsPage /></AdminLayout></AdminRoute>`
  - Envolver rotas admin existentes no `AdminLayout`

---

## Passo 8 — Frontend: AdminLayout

- [x] Criar `frontend/src/components/admin/AdminLayout.tsx`
  - Header simplificado: `LogoSvg` + texto "Painel Admin" (font-sans, uppercase, tracking-wider)
  - Sidebar esquerda (w-48, border-r border-swell-border):
    - Link "Produtos" → `/admin`
    - Link "Editar Site" → `/admin/site`
    - Link ativo: `border-l-2 border-swell-accent bg-swell-bg text-swell-accent`
  - `<Outlet />` para conteúdo à direita
  - Sem Header/CartSidebar da loja pública

---

## Passo 9 — Frontend: SiteSettingsPage

- [x] Criar `frontend/src/pages/admin/SiteSettingsPage.tsx`
  - Formulário inicializado com valores de `settingsStore.settings`
  - Campo "Nome da Loja" — input text
  - Campo "Texto do Hero" — input text
  - Campo "Imagem do Hero" — reutilizar `ImageUpload` existente (aceitar apenas 1 imagem)
  - Campo "Cor Secundária" — dois swatches clicáveis:
    - Swatch `#A98F81` com label "Original"
    - Swatch `#187f0f` com label "Verde"
    - Selecionado: borda `ring-2 ring-swell-accent`
  - Submit: monta `FormData`, chama `settingsApi.updateSettings()`, chama `settingsStore.update()`
  - Feedback: estado de loading + mensagem de sucesso/erro

---

## Passo 10 — Frontend: Componentes dinâmicos

- [x] Atualizar `frontend/src/components/layout/Header.tsx`
  - Importar `useSettingsStore`
  - Substituir nome hardcoded por `settings?.store_name ?? 'Swell'`
- [x] Atualizar `frontend/src/pages/HomePage.tsx`
  - Importar `useSettingsStore`
  - Hero `<h1>`: `settings?.hero_text ?? 'Nova Coleção 2025'`
  - Hero `<img>`: `settings?.hero_image ?? '/images/hero-default.jpg'`

---

## Passo 11 — Verificação

- [ ] Rebuild dos containers: `docker compose up --build backend frontend -d`
- [ ] Rodar seed: `docker compose exec backend python -m scripts.seed`
- [ ] Verificar `GET /api/v1/settings` retorna settings padrão
- [ ] Verificar que a cor original `#A98F81` continua aplicada após migração de CSS vars
- [ ] Acessar `/admin/site`, alterar nome da loja → conferir reflexo no Header sem reload de página
- [ ] Acessar `/admin/site`, selecionar cor verde → conferir que botões/links mudam para `#187f0f`
- [ ] Upload de imagem hero → conferir exibição na HomePage
