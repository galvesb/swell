# Design Técnico: Swell Store Full-Stack

## 1. Arquitetura de Pastas

### Backend (FastAPI)

```
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py            # POST /login, /logout, /refresh, /register
│   │   │   │   ├── products.py        # GET /products (público), GET /products/{slug}
│   │   │   │   ├── categories.py      # GET /categories (público)
│   │   │   │   ├── cart.py            # CRUD carrinho (auth required)
│   │   │   │   └── admin/
│   │   │   │       └── products.py    # CRUD admin (role=admin required)
│   │   │   └── router.py              # Agrega todos os endpoints v1
│   │   └── deps.py                    # get_current_user, require_admin
│   ├── core/
│   │   ├── config.py                  # pydantic-settings (lê .env)
│   │   └── security.py                # hash_password, verify_password, create_jwt
│   ├── db/
│   │   ├── mongodb.py                 # Motor client + Beanie init
│   │   └── repositories/
│   │       ├── base.py                # BaseRepository[T] genérico
│   │       ├── user_repo.py           # find_by_email, create
│   │       ├── product_repo.py        # find_with_filters, paginate
│   │       └── cart_repo.py           # upsert_item, merge_guest_cart
│   ├── models/                        # Beanie Documents (estrutura no MongoDB)
│   │   ├── user.py
│   │   ├── product.py
│   │   └── cart_item.py
│   ├── schemas/                       # Pydantic (request/response — nunca expõe model direto)
│   │   ├── user.py                    # UserCreate, UserResponse, UserLogin
│   │   ├── product.py                 # ProductCreate, ProductUpdate, ProductResponse, ProductFilters
│   │   ├── cart.py                    # CartItemCreate, CartItemResponse, CartMergeRequest
│   │   └── token.py                   # TokenResponse
│   ├── services/                      # Regras de negócio (sem acesso direto ao banco)
│   │   ├── auth_service.py            # authenticate, register, refresh_token
│   │   ├── product_service.py         # list_products (filtros), get_by_slug, create, update
│   │   └── cart_service.py            # add_item, remove_item, merge_guest_cart
│   └── main.py                        # App FastAPI, lifespan, middlewares
├── uploads/                           # Imagens servidas pelo Nginx
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   └── test_products.py
├── .env.example
├── pyproject.toml
└── Dockerfile
```

### Frontend (React)

```
frontend/
├── src/
│   ├── api/                           # Camada de comunicação com o backend
│   │   ├── client.ts                  # axios instance + interceptors (token + refresh)
│   │   ├── auth.ts                    # login(), logout(), register(), refresh()
│   │   ├── products.ts                # listProducts(filters), getProduct(slug)
│   │   └── cart.ts                    # getCart(), addItem(), removeItem(), mergeCart()
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx             # Sticky header (desktop + mobile)
│   │   │   ├── MobileMenu.tsx         # Sidebar esquerda (nav mobile)
│   │   │   └── CartSidebar.tsx        # Sidebar direita (sacola)
│   │   ├── products/
│   │   │   ├── ProductGrid.tsx        # Grid 4-col / 2-col responsivo
│   │   │   ├── ProductCard.tsx        # Card com imagem 2:3 + ações
│   │   │   ├── ProductCarousel.tsx    # Embla Carousel para imagens do produto
│   │   │   └── FilterSidebar.tsx      # Filtros + ordenação
│   │   ├── admin/
│   │   │   ├── ProductForm.tsx        # Formulário criar/editar produto
│   │   │   └── ImageUpload.tsx        # Upload múltiplo com preview
│   │   └── ui/
│   │       ├── ProtectedRoute.tsx     # Redireciona /login se não autenticado
│   │       └── AdminRoute.tsx         # Redireciona /403 se role != admin
│   ├── hooks/
│   │   ├── useAuth.ts                 # login, logout, register
│   │   ├── useCart.ts                 # add, remove, sync com backend
│   │   └── useProducts.ts             # listagem com filtros + paginação
│   ├── pages/
│   │   ├── CategoryPage.tsx           # Catálogo com filtros (rota: /:category)
│   │   ├── ProductDetailPage.tsx      # Detalhe do produto (rota: /produto/:slug)
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ForbiddenPage.tsx          # 403
│   │   └── admin/
│   │       ├── AdminDashboard.tsx     # Listagem de produtos admin
│   │       └── AdminProductForm.tsx   # Criar / editar produto
│   ├── store/
│   │   ├── authStore.ts               # Zustand: user + accessToken (somente memória)
│   │   └── cartStore.ts               # Zustand + persist: cart guest (localStorage)
│   ├── types/
│   │   ├── product.ts
│   │   ├── user.ts
│   │   └── cart.ts
│   ├── App.tsx                        # Router + layout
│   └── main.tsx
├── public/
├── .env.local.example
├── vite.config.ts
├── tailwind.config.ts
└── Dockerfile
```

---

## 2. Modelagem de Dados (MongoDB + Pydantic)

### Collection: `users`

```
Beanie Document:
  _id:              ObjectId
  email:            str  (unique, indexed)
  hashed_password:  str
  full_name:        str
  role:             Literal["customer", "admin"]  default="customer"
  is_active:        bool  default=True
  created_at:       datetime

Índices: email (unique)
```

**Pydantic Schemas:**
```
UserCreate:   email, password (min 8, regex força), full_name
UserResponse: id, email, full_name, role, is_active
              ← NUNCA expõe hashed_password
UserLogin:    email, password
```

---

### Collection: `products`

```
Beanie Document:
  _id:          ObjectId
  name:         str
  slug:         str  (unique, indexed)  ← URL-friendly, ex: "blazer-alfaiataria-preto"
  description:  str
  category:     str  (indexed)          ← "alfaiataria", "best-sellers", "sale"...
  tags:         list[str]               ← ["new_in", "best_seller", "last_pieces", "sale"]
  price:        float
  sale_price:   float | None            ← preço com desconto
  stock:        int
  sizes:        list[str]               ← ["XPP", "PP", "P", "M", "G", "GG"]
  colors:       list[ColorOption]       ← embedded document
  images:       list[str]               ← ["/uploads/abc123.webp", ...]
  is_active:    bool  default=True
  sold_count:   int   default=0         ← para sort "mais vendido"
  created_at:   datetime

Embedded: ColorOption { name: str, hex: str }
Índices: slug (unique), category, tags, price, is_active, created_at
```

**Pydantic Schemas:**
```
ProductCreate:  name, description, category, tags, price, sale_price?,
                stock, sizes, colors, images
ProductUpdate:  todos os campos opcionais (PATCH)
ProductResponse: todos os campos + id (sem _id exposto bruto)
ProductFilters: category?, min_price?, max_price?, sizes?, colors?,
                tags?, sort_by?, page=1, page_size=20
```

---

### Collection: `cart_items`

```
Beanie Document:
  _id:         ObjectId
  user_id:     ObjectId  (indexed)
  product_id:  ObjectId
  quantity:    int
  size:        str
  color:       str
  added_at:    datetime

Índice composto único: (user_id, product_id, size, color)
  → previne duplicatas; merge soma quantity no upsert
```

---

### Collection: `categories`

```
Beanie Document:
  _id:         ObjectId
  slug:        str  (unique)
  name:        str
  description: str
  order:       int  ← define a ordem no nav
```

---

## 3. Contratos de API

### Auth

| Método | Path | Proteção | Entrada | Saída |
|---|---|---|---|---|
| POST | `/api/v1/auth/register` | Pública | `UserCreate` | `UserResponse` |
| POST | `/api/v1/auth/login` | Pública (rate limit 5/min) | `email, password` (form) | `{access_token}` + cookie `refresh_token` HttpOnly |
| POST | `/api/v1/auth/logout` | Auth | — | 200, limpa cookie |
| POST | `/api/v1/auth/refresh` | Cookie refresh_token | — | `{access_token}` novo |
| GET | `/api/v1/auth/me` | Auth | — | `UserResponse` |

### Produtos (Público)

| Método | Path | Proteção | Entrada | Saída |
|---|---|---|---|---|
| GET | `/api/v1/products` | Pública | Query params: `category, min_price, max_price, sizes, colors, tags, sort_by, page, page_size` | `{items: ProductResponse[], total, page, pages}` |
| GET | `/api/v1/products/{slug}` | Pública | — | `ProductResponse` |
| GET | `/api/v1/categories` | Pública | — | `CategoryResponse[]` |

**Exemplo de query de filtro paginada:**
```
GET /api/v1/products?category=alfaiataria&min_price=100&max_price=500
    &sizes=P&sizes=M&colors=preto&tags=new_in&sort_by=price_asc&page=1&page_size=20

Response:
{
  "items": [...],
  "total": 47,
  "page": 1,
  "page_size": 20,
  "pages": 3
}
```

### Carrinho (Auth)

| Método | Path | Proteção | Entrada | Saída |
|---|---|---|---|---|
| GET | `/api/v1/cart` | Auth | — | `CartItemResponse[]` |
| POST | `/api/v1/cart/items` | Auth | `{product_id, quantity, size, color}` | `CartItemResponse` |
| PATCH | `/api/v1/cart/items/{id}` | Auth | `{quantity}` | `CartItemResponse` |
| DELETE | `/api/v1/cart/items/{id}` | Auth | — | 204 |
| POST | `/api/v1/cart/merge` | Auth | `{items: GuestCartItem[]}` | `CartItemResponse[]` |

### Admin (role=admin)

| Método | Path | Proteção | Entrada | Saída |
|---|---|---|---|---|
| GET | `/api/v1/admin/products` | Admin | Query paginação + filtros | `{items, total, page, pages}` |
| POST | `/api/v1/admin/products` | Admin | `ProductCreate` (JSON) | `ProductResponse` |
| PATCH | `/api/v1/admin/products/{id}` | Admin | `ProductUpdate` (JSON parcial) | `ProductResponse` |
| DELETE | `/api/v1/admin/products/{id}` | Admin | — | 204 |
| POST | `/api/v1/admin/products/{id}/images` | Admin | `multipart/form-data` (max 5 arquivos, 5MB cada, JPEG/PNG/WEBP) | `{images: string[]}` |
| DELETE | `/api/v1/admin/products/{id}/images` | Admin | `{filename: str}` | 204 |

---

## 4. Estratégia de Segurança

### Fluxo de Autenticação Completo

```
┌─────────────────────────────────────────────────────────────────┐
│  FLUXO JWT — LOGIN E REQUISIÇÕES SUBSEQUENTES                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. LOGIN                                                       │
│  ─────────────────────────────────────────────────────────      │
│  Frontend → POST /auth/login { email, password }                │
│  Backend:                                                       │
│    a. Busca user por email no MongoDB                           │
│    b. bcrypt.verify(password, hashed_password)                  │
│    c. Gera access_token (JWT, exp=30min, sub=user_id)           │
│    d. Gera refresh_token (JWT, exp=7days, sub=user_id)          │
│    e. Retorna: JSON { access_token } no body                    │
│               Set-Cookie: refresh_token=<val>;                  │
│                           HttpOnly; Secure; SameSite=Strict     │
│  Frontend:                                                      │
│    → Salva access_token em Zustand (memória RAM apenas)         │
│    → Cookie é gerenciado automaticamente pelo browser           │
│                                                                 │
│  2. REQUISIÇÕES AUTENTICADAS                                    │
│  ─────────────────────────────────────────────────────────      │
│  Frontend → axios interceptor injeta:                           │
│    Authorization: Bearer <access_token>  (do Zustand)           │
│    Cookie: refresh_token=<val>           (automático)           │
│  Backend → deps.py: get_current_user()                          │
│    → jwt.decode(token) → user_id → User.get(user_id)           │
│                                                                 │
│  3. REFRESH (quando access_token expira)                        │
│  ─────────────────────────────────────────────────────────      │
│  axios interceptor detecta 401                                  │
│  → POST /auth/refresh (envia cookie automaticamente)            │
│  Backend valida refresh_token do cookie                         │
│  → Retorna novo access_token                                    │
│  → Frontend atualiza Zustand e reexecuta a requisição original  │
│                                                                 │
│  4. LOGOUT                                                      │
│  ─────────────────────────────────────────────────────────      │
│  POST /auth/logout                                              │
│  Backend: response.delete_cookie("refresh_token")              │
│  Frontend: authStore.logout() → Zustand zerado                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Biblioteca de Hash de Senha

**`passlib[bcrypt]`** com work factor 12 (padrão recomendado em 2024).

```python
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed = pwd_context.hash(plain_password)      # no register
valid  = pwd_context.verify(plain, hashed)     # no login
```

> Bcrypt foi escolhido sobre Argon2 por ser o default mais estável no ecossistema Python/passlib, com resistência comprovada a ataques de GPU. Argon2 pode ser migrado como upgrade futuro sem quebrar a estrutura.

### Outros controles de segurança

| Controle | Implementação |
|---|---|
| Rate limiting | `SlowAPI`: 5 req/min em `/auth/login` e `/auth/register` |
| CORS | `CORSMiddleware` com `allow_origins=[settings.ALLOWED_ORIGINS]` — NUNCA `"*"` |
| Security headers | `python-secure`: CSP, HSTS, X-Frame-Options, X-Content-Type |
| Validação de input | Pydantic em todas as rotas — sem queries dinâmicas brutas ao MongoDB |
| Upload seguro | Validação de MIME type + extensão + tamanho max 5MB por arquivo |
| RBAC | `Depends(require_admin)` nas rotas admin — verifica `user.role == "admin"` |
| Índice único email | Previne registro duplicado e user enumeration timing attacks |
| Token sem dados sensíveis | JWT carrega apenas `sub=user_id` e `exp` |

---

## 5. Docker Compose

```
┌──────────────────────────────────────────────────────────────┐
│  Serviços Docker                                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  nginx          (porta 80 externa)                           │
│  ├── /api/*   → proxy pass → backend:8000                   │
│  ├── /uploads → serve estático volume de imagens            │
│  └── /*       → proxy pass → frontend:5173                  │
│                                                              │
│  backend        (FastAPI + Uvicorn)                          │
│  ├── porta interna: 8000                                     │
│  ├── volume: ./backend/uploads:/app/uploads                  │
│  ├── env: .env (MONGODB_URL, SECRET_KEY, ALLOWED_ORIGINS...) │
│  └── depende de: mongo (healthcheck)                         │
│                                                              │
│  frontend       (Vite dev server em dev / nginx em prod)     │
│  ├── porta interna: 5173                                     │
│  └── env: VITE_API_URL=http://nginx/api/v1                   │
│                                                              │
│  mongo          (MongoDB 7)                                  │
│  ├── porta interna: 27017                                    │
│  ├── volume nomeado: mongo_data                              │
│  └── env: MONGO_INITDB_ROOT_USERNAME/PASSWORD                │
│                                                              │
│  Volumes:                                                    │
│    mongo_data     (persistência do banco)                    │
│    uploads_data   (imagens — compartilhado backend/nginx)    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Decisões de Design Registradas

| Decisão | Escolha | Motivo |
|---|---|---|
| ODM | Beanie (sobre Motor puro) | API de alto nível com validação Pydantic nativa |
| Hash | bcrypt (passlib) | Ecossistema Python estável, resistente a GPU |
| JWT storage | access em memória, refresh em cookie HttpOnly | Anti-XSS; SameSite=Strict = anti-CSRF |
| Cart guest | Zustand + persist (localStorage) | UX sem login obrigatório; merge ao autenticar |
| Images | Filesystem local + Nginx | MVP zero-custo; S3 como extensão futura |
| Sort "relevância" | `created_at DESC` no MVP | `sold_count` como critério real no futuro |
| Carousel | Embla Carousel | Leve, sem deps, headless, compatível com TailwindCSS |
| Icons | Phosphor Icons (React pkg) | Fidelidade ao `index.html` original |
| Slug | Gerado automaticamente no backend | URL amigável, SEO-friendly, não expõe `_id` |
