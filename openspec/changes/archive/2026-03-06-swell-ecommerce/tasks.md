# Tasks: Swell Store — Implementação

## Passo 1 — Setup do Ambiente e Infraestrutura

- [x] Criar estrutura de diretórios completa (`backend/`, `frontend/`, `nginx/`)
- [x] Configurar `docker-compose.yml` com 4 serviços: nginx, backend, frontend, mongo
- [x] Escrever `nginx/nginx.conf` (proxy /api → backend, /uploads → estático, / → frontend)
- [x] Criar `backend/Dockerfile` (Python 3.12 slim, multi-stage)
- [x] Criar `frontend/Dockerfile` (Node 20 Alpine, Vite dev)
- [x] Criar `backend/.env.example` com todas as variáveis necessárias
- [x] Criar `frontend/.env.local.example` com `VITE_API_URL`
- [x] Verificar que `docker compose up` sobe todos os serviços sem erro

---

## Passo 2 — Backend: Core e Banco de Dados

- [x] Configurar `pyproject.toml` com todas as dependências
- [x] Implementar `app/core/config.py` (pydantic-settings, lê `.env`)
- [x] Implementar `app/core/security.py` (hash_password, verify_password, create_access_token, create_refresh_token, decode_token)
- [x] Implementar `app/db/mongodb.py` (Motor client + Beanie `init_beanie`)
- [x] Implementar Beanie Documents em `app/models/` (user, product, cart_item, category)
- [x] Implementar `app/main.py` com lifespan, CORS, security headers, SlowAPI

---

## Passo 3 — Backend: Repositories

- [x] Implementar `app/db/repositories/base.py` (BaseRepository[T] genérico)
- [x] Implementar `app/db/repositories/user_repo.py`
- [x] Implementar `app/db/repositories/product_repo.py` (filtros dinâmicos, paginação)
- [x] Implementar `app/db/repositories/cart_repo.py` (upsert, merge)

---

## Passo 4 — Backend: Schemas Pydantic

- [x] Implementar `app/schemas/user.py` (UserCreate com validator de senha, UserResponse)
- [x] Implementar `app/schemas/product.py` (ProductCreate, ProductUpdate, ProductResponse, ProductFilters, ProductListResponse)
- [x] Implementar `app/schemas/cart.py` (CartItemCreate, CartItemResponse, CartMergeRequest)
- [x] Implementar `app/schemas/token.py` (TokenResponse)

---

## Passo 5 — Backend: Services

- [x] Implementar `app/services/auth_service.py` (authenticate, register, refresh_access_token)
- [x] Implementar `app/services/product_service.py` (list, get_by_slug, create, update, delete, save_images, delete_image)
- [x] Implementar `app/services/cart_service.py` (get_cart, add_item, update_item, remove_item, merge_guest_cart)

---

## Passo 6 — Backend: Routers e Dependências

- [x] Implementar `app/api/deps.py` (get_current_user, require_admin)
- [x] Implementar `app/api/v1/endpoints/auth.py` (register, login com rate limit, logout, refresh, me)
- [x] Implementar `app/api/v1/endpoints/products.py` (list com filtros, get by slug)
- [x] Implementar `app/api/v1/endpoints/categories.py`
- [x] Implementar `app/api/v1/endpoints/cart.py` (CRUD + merge)
- [x] Implementar `app/api/v1/endpoints/admin/products.py` (CRUD admin + upload/delete imagens)
- [x] Registrar todos os routers em `app/api/v1/router.py`

---

## Passo 7 — Frontend: Setup

- [x] Criar `package.json` com todas as dependências
- [x] Configurar `tailwind.config.ts` com tokens de design do `index.html`
- [x] Configurar `vite.config.ts` com alias `@/` para `src/`
- [x] Criar `index.html` com fontes Google Fonts
- [x] Criar `src/index.css` com Tailwind base
- [x] Criar `src/main.tsx` ponto de entrada

---

## Passo 8 — Frontend: Store e API Client

- [x] Implementar `src/store/authStore.ts` (Zustand: user + accessToken em memória)
- [x] Implementar `src/store/cartStore.ts` (Zustand + persist para guest cart)
- [x] Implementar `src/api/client.ts` (axios + interceptors de refresh)
- [x] Implementar `src/api/auth.ts`, `products.ts`, `cart.ts`
- [x] Implementar `src/types/` (user.ts, product.ts, cart.ts)

---

## Passo 9 — Frontend: Componentes de Layout

- [x] Implementar `Header.tsx` (desktop + mobile responsivo)
- [x] Implementar `MobileMenu.tsx` (sidebar esquerda)
- [x] Implementar `CartSidebar.tsx` (sidebar direita com progresso de frete)
- [x] Implementar `LogoSvg.tsx` (fiel ao index.html original)

---

## Passo 10 — Frontend: Catálogo de Produtos

- [x] Implementar `FilterSidebar.tsx` (filtros + ordenação via URL params)
- [x] Implementar `ProductCard.tsx` (imagem 2:3 + overlay + tags + preço)
- [x] Implementar `ProductCarousel.tsx` (Embla Carousel)
- [x] Implementar `ProductGrid.tsx` (4-col/2-col + loading skeleton + paginação)
- [x] Implementar `useProducts.ts` hook
- [x] Implementar `CategoryPage.tsx` (breadcrumb + header + grid + filtros)

---

## Passo 11 — Frontend: Autenticação e Carrinho

- [x] Implementar `LoginPage.tsx`
- [x] Implementar `RegisterPage.tsx`
- [x] Implementar `ProtectedRoute.tsx` e `AdminRoute.tsx`
- [x] Implementar `useAuth.ts` hook (login + merge de cart + registro)
- [x] Implementar `useCart.ts` hook (guest + autenticado)
- [x] Implementar `ForbiddenPage.tsx` (403)

---

## Passo 12 — Frontend: Painel Administrativo

- [x] Implementar `AdminDashboard.tsx` (tabela de produtos com paginação)
- [x] Implementar `AdminProductForm.tsx` (criar + editar produto)
- [x] Implementar `ImageUpload.tsx` (upload múltiplo com preview)

---

## Passo 13 — Página de Detalhe do Produto

- [x] Implementar `ProductDetailPage.tsx` (carrossel + info + seletor tamanho/cor + add to cart)

---

## Passo 14 — Testes e Seed de Dados

- [x] Implementar `tests/conftest.py`
- [x] Escrever `tests/test_auth.py`
- [x] Escrever `tests/test_products.py`
- [x] Criar `scripts/seed.py` (admin user + categorias + produtos de exemplo)

---

## Passo 15 — Revisão Final e Verificações

- [x] Criar `.gitignore` completo
- [x] Escrever `README.md` com instruções completas
- [ ] Verificar responsividade em mobile
- [ ] Verificar fluxo completo: guest → cart → login → merge
- [ ] Verificar fluxo admin: login → criar produto → upload
- [ ] Confirmar que `docker compose up --build` sobe sem erros
