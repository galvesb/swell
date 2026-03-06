# Swell Store 🐚

E-commerce full-stack moderno e seguro, migrado de protótipo estático para aplicação completa.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS + Zustand |
| Backend | Python 3.12 + FastAPI (assíncrono) |
| Banco de Dados | MongoDB 7 + Beanie ODM |
| Segurança | bcrypt, JWT (HttpOnly cookies), SlowAPI, CORS restritivo |
| Containers | Docker Compose + Nginx |

## Início Rápido

### 1. Clonar e configurar variáveis

```bash
cp backend/.env.example backend/.env
# Edite backend/.env com suas configurações
# Gere um SECRET_KEY seguro:
# openssl rand -hex 32
```

### 2. Subir com Docker Compose

```bash
docker compose up --build
```

### 3. Popular banco com dados iniciais

```bash
docker compose exec backend python -m scripts.seed
```

### 4. Acessar

| URL | Descrição |
|---|---|
| http://localhost | Loja (frontend) |
| http://localhost/docs | Swagger API (apenas em DEBUG=true) |
| http://localhost/admin | Painel Admin |

**Credenciais admin padrão (após seed):**
- E-mail: `admin@swell.com`
- Senha: `Admin@123`

> ⚠️ Troque a senha do admin em produção!

## Variáveis de Ambiente (backend/.env)

| Variável | Descrição | Exemplo |
|---|---|---|
| `MONGODB_URL` | Connection string do MongoDB | `mongodb://user:pass@mongo:27017/swelldb?authSource=admin` |
| `MONGODB_DB_NAME` | Nome do banco | `swelldb` |
| `SECRET_KEY` | Chave JWT (32+ bytes hex) | `openssl rand -hex 32` |
| `ALGORITHM` | Algoritmo JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiração do access token | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Expiração do refresh token | `7` |
| `ALLOWED_ORIGINS` | Origens CORS permitidas (JSON array) | `["http://localhost"]` |
| `UPLOAD_DIR` | Diretório de uploads | `/app/uploads` |
| `MAX_IMAGE_SIZE_MB` | Tamanho máximo de imagem | `5` |
| `DEBUG` | Habilita /docs e logs verbose | `false` |

## Arquitetura

```
swell/
├── backend/          FastAPI (Clean Architecture)
│   ├── app/
│   │   ├── api/      Routers + Dependências
│   │   ├── core/     Config + Security
│   │   ├── db/       MongoDB + Repositories
│   │   ├── models/   Beanie Documents
│   │   ├── schemas/  Pydantic (request/response)
│   │   └── services/ Regras de Negócio
│   ├── scripts/      seed.py
│   └── tests/
├── frontend/         React + Vite + TailwindCSS
│   └── src/
│       ├── api/      HTTP clients
│       ├── components/ Componentes reutilizáveis
│       ├── hooks/    Custom hooks
│       ├── pages/    Páginas
│       ├── store/    Zustand stores
│       └── types/    TypeScript types
├── nginx/            Reverse proxy config
└── docker-compose.yml
```

## Segurança (OWASP Top 10)

- ✅ Senhas hasheadas com **bcrypt** (work factor 12)
- ✅ JWT **access token em memória** (Zustand), **refresh em cookie HttpOnly**
- ✅ **Rate limiting** em `/auth/login` e `/auth/register` (SlowAPI)
- ✅ **CORS restritivo** — apenas origens declaradas em `ALLOWED_ORIGINS`
- ✅ **Security headers** via python-secure (CSP, HSTS, X-Frame-Options)
- ✅ **Validação de input** — Pydantic em todas as rotas
- ✅ **RBAC** — painel admin acessível apenas por `role=admin`
- ✅ **Validação de uploads** — MIME type + extensão + tamanho (5MB)
- ✅ **Sem queries dinâmicas** — Beanie ODM previne NoSQL injection

## Funcionalidades

- 🛍️ Catálogo com filtros dinâmicos (categoria, preço, tamanho, cor, tag)
- 📄 Paginação server-side
- 🛒 Carrinho guest (localStorage) com merge ao autenticar
- 🔐 Autenticação completa (registro, login, refresh, logout)
- 👑 Painel admin (CRUD produtos, upload de imagens)
- 📱 Design responsivo (mobile-first, fiel ao protótipo original)
- 🎠 Carrossel de imagens (Embla Carousel)

## Desenvolvimento (sem Docker)

```bash
# Backend
cd backend
pip install -e ".[dev]"
uvicorn app.main:app --reload

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```
