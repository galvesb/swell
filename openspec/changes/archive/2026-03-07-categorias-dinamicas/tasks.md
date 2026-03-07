# Tasks: Categorias Dinamicas

## Backend

- [x] Criar CategoryRepository em `backend/app/db/repositories/category_repo.py` (CRUD + find_by_slug, find_all_ordered, slug_exists)
- [x] Criar schemas em `backend/app/schemas/category.py` (CategoryCreate, CategoryUpdate, CategoryResponse, CategoryListResponse)
- [x] Criar CategoryService em `backend/app/services/category_service.py` (CRUD com slug auto-gerado)
- [x] Criar dependency `get_category_service` em `backend/app/api/deps.py`
- [x] Criar endpoints admin em `backend/app/api/v1/endpoints/admin/categories.py` (GET, POST, PATCH, DELETE)
- [x] Criar endpoint publico em `backend/app/api/v1/endpoints/categories.py` (GET /categories)
- [x] Registrar routers no app (admin/categories e public/categories)
- [x] Atualizar seed: criar categorias iniciais + atualizar category dos produtos existentes

## Frontend — API client

- [x] Criar `frontend/src/api/categories.ts` com categoriesApi (list, adminList, create, update, delete)

## Frontend — Admin

- [x] Refatorar SiteSettingsPage em pagina com tabs: Geral + Categorias
- [x] Criar componente da aba Categorias com CRUD inline (lista, criar, editar, excluir)
- [x] Atualizar AdminProductForm: trocar hardcode `category: 'roupas'` por dropdown dinamico carregando de GET /categories

## Frontend — Loja

- [x] Atualizar FilterSidebar: adicionar secao "Categorias" com botoes toggle carregados de GET /categories
- [x] Atualizar useProducts hook: quando category === "roupas", nao enviar category na query da API

## Deploy

- [x] Deploy na VM (make deploy) + rodar seed atualizado
