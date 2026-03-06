# Proposal: Admin Site Settings

## O que é

Adicionar ao painel administrativo do Swell:

1. **Admin Layout com navegação** — sidebar com "Produtos" e "Editar Site", reaproveitando os tokens visuais da loja (Playfair Display, Montserrat, `swell-*` classes).
2. **"Editar Site"** — formulário admin para configurar dinamicamente: nome da loja, hero banner (imagem + texto) e cor secundária (restrita a 2 opções).
3. **SiteSettings Singleton** — collection MongoDB com documento único; backend serve via `GET /settings` (público, cache em memória) e `PUT /settings` (admin protegido); frontend injeta no carregamento inicial da aplicação.

## Por que

O painel admin atual (`AdminDashboard`) é funcional mas genérico — sem navegação própria e sem conexão visual com o site. Além disso, configurações como nome da loja e hero banner estão hardcoded no frontend, exigindo redeploy para qualquer alteração editorial.

Esta mudança resolve os dois problemas:
- Dá ao admin uma experiência coesa com o restante da loja.
- Permite que o administrador altere conteúdo público sem intervenção técnica.

## Decisões confirmadas

| Decisão | Escolha |
|---|---|
| Persistência das settings | MongoDB (Beanie Document Singleton) |
| Cache | Variável de módulo in-process, TTL invalidado por PUT |
| Cor secundária | Enum restrito: `#A98F81` (original) ou `#187f0f` (verde) |
| Injeção de cor no frontend | CSS custom properties em `:root` |
| State global no frontend | Zustand `settingsStore` (sem persist — busca do server no mount) |
| Upload da imagem hero | Reutiliza mecanismo existente de `/uploads/` |
| Título da página (SEO) | `document.title` via `useEffect` no `App.tsx` |

## Escopo

### In scope
- `AdminLayout.tsx` com sidebar e duas seções: Produtos e Editar Site
- `SiteSettingsPage.tsx` com formulário (nome, hero text, hero image, color swatches)
- `settingsStore.ts` (Zustand) com `init()` chamado no `App.tsx`
- Migração de `swell-accent` no `tailwind.config.ts` para `var(--swell-accent)`
- `backend/app/models/site_settings.py` — Beanie Document Singleton
- `backend/app/schemas/settings.py` — Pydantic schemas
- `backend/app/services/settings_service.py` — lógica + cache
- `backend/app/api/v1/endpoints/admin/settings.py` — rotas PUT/GET
- Registro do modelo no `init_beanie` e rota no router
- Header.tsx lê nome dinâmico do `settingsStore`
- HomePage.tsx lê hero dinâmico do `settingsStore`
- `scripts/seed.py` insere o documento de settings padrão

### Out of scope
- Múltiplos temas (além das 2 cores definidas)
- Internacionalização (i18n)
- Preview ao vivo no painel admin
- Histórico de alterações / auditoria
