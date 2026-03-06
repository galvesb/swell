# Design: Rename Tags + Seção Principais

## Tag Mapping

| Antes          | Depois          |
|----------------|-----------------|
| `new_in`       | `novos`         |
| `best_seller`  | `mais_vendidos` |
| `last_pieces`  | `ultimas_pecas` |
| `sale`         | `promocoes`     |
| (nova)         | `principal`     |

## Backend

### Model (`app/models/product.py`)
- Atualizar `Literal` para novos nomes + `"principal"`

### Schemas (`app/schemas/product.py`)
- Atualizar `Literal` em `ProductCreate`, `ProductUpdate`, `ProductFilters`

### Seed (`scripts/seed.py`)
- Atualizar tags dos produtos existentes para novos nomes
- Adicionar tag `"principal"` em alguns produtos do seed

## Frontend

### Types (`types/product.ts`)
- `ProductTag = 'novos' | 'mais_vendidos' | 'ultimas_pecas' | 'promocoes' | 'principal'`

### ProductCard (`components/products/ProductCard.tsx`)
- `.includes('novos')` → badge "novo!"
- `.includes('ultimas_pecas')` → badge "vai acabar!"
- `.includes('promocoes')` → badge "Promoção"

### ProductDetailPage (`pages/ProductDetailPage.tsx`)
- Mesmas substituições de `.includes()`

### FilterSidebar (`components/products/FilterSidebar.tsx`)
- Atualizar values e labels:
  - `novos` → "Novo!"
  - `promocoes` → "Promoções"
  - `ultimas_pecas` → "Últimas Peças"
  - `mais_vendidos` → "Mais Vendido"

### AdminProductForm (`pages/admin/AdminProductForm.tsx`)
- `ALL_TAGS = ['novos', 'mais_vendidos', 'ultimas_pecas', 'promocoes', 'principal']`

### HomePage (`pages/HomePage.tsx`)
- Título: "Principais"
- Instalar `embla-carousel-react`
- Buscar produtos com tag `principal` via API (`productsApi.list({ tags: ['principal'] })`)
- Desktop (md+): carrossel Embla, 4 slides visíveis, setas prev/next
- Mobile (<md): grid `grid-cols-2`, sem carrossel, mostra todos
- Cada item: visual atual (imagem aspect 2/3, overlay escuro, nome + preço)

## Decisões
- Embla Carousel (~3KB) escolhido por ser leve e ter API de hooks React
- Tag `principal` não aparece no FilterSidebar (só para admin)
- Sem migração de banco — seed será recriado
