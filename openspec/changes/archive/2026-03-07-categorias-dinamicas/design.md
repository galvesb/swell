# Design: Categorias Dinamicas

## Backend

### Model (ja existe)
`backend/app/models/category.py` — Category(Document): slug, name, description, order

### Endpoints novos

**Admin (protegidos por require_admin):**
- `GET    /admin/categories` — lista todas ordenadas por `order`
- `POST   /admin/categories` — cria categoria (gera slug a partir do name)
- `PATCH  /admin/categories/{id}` — atualiza name/description/order
- `DELETE /admin/categories/{id}` — remove categoria

**Publico:**
- `GET /categories` — lista categorias ativas ordenadas por `order`

### Schemas
- `CategoryCreate`: name (required), description (optional)
- `CategoryUpdate`: name (optional), description (optional), order (optional)
- `CategoryResponse`: id, slug, name, description, order

### Service
- `CategoryService` com CRUD basico
- Slug gerado automaticamente via `slugify(name)` com dedup (igual ao produto)
- Delete verifica se ha produtos usando a categoria (retorna erro ou permite)

### Product.category
- Continua como `str` (slug da categoria)
- Remove o hardcode de "roupas" no admin form
- Admin form carrega categorias do endpoint e mostra dropdown

### CategoryPage `/categoria/roupas`
- `useProducts` hook: quando category === "roupas", NAO passa `category` na query
- Todos os produtos sao retornados
- Filtro por categoria acontece via sidebar (?category=vestidos)

## Frontend

### Admin — "Editar Site" com submenus

Arquivo: `frontend/src/pages/admin/SiteSettingsPage.tsx`

Transforma em pagina com tabs/submenus:
- **Geral**: conteudo atual (nome loja, hero, cor)
- **Categorias**: CRUD inline

Layout:
```
[Geral]  [Categorias]
─────────────────────
  conteudo da aba
```

### Admin — Aba Categorias
- Lista categorias com nome + botoes editar/excluir
- Botao "+ Nova Categoria" abre inline form (nome, descricao)
- Sem drag-and-drop (simplicidade) — order editavel por campo numerico ou setas

### Admin — Formulario de Produto
- Remove hardcode `category: 'roupas'`
- Adiciona dropdown que carrega categorias de `GET /categories`
- Campo obrigatorio

### Loja — FilterSidebar
- Nova secao "Categorias" acima de "Ordenar por"
- Carrega categorias de `GET /categories`
- Renderiza como botoes toggle (mesmo estilo dos tags)
- Selecionar adiciona `?category=vestidos` nos searchParams
- Selecao unica (radio-like) — pois produto tem 1 categoria

### Loja — useProducts hook
- Quando `category === "roupas"`: nao envia `category` na API query
- Quando sidebar seleciona categoria: passa `?category=<slug>` normalmente

### API client
- `categoriesApi.list()` — GET /categories
- `categoriesApi.adminList()` — GET /admin/categories
- `categoriesApi.create(data)` — POST /admin/categories
- `categoriesApi.update(id, data)` — PATCH /admin/categories/{id}
- `categoriesApi.delete(id)` — DELETE /admin/categories/{id}

## Seed
- Criar categorias: Vestidos, Blusas, Calcas, Saias (ou similar)
- Atualizar produtos existentes para usar slugs das novas categorias
