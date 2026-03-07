# Proposal: Rename Tags + Seção Principais

## What
Renomear as tags de produto para português e adicionar nova seção "Principais" na homepage com carrossel.

## Why
Tags em inglês não fazem sentido para o público-alvo brasileiro. A seção "Nossas Categorias" com links estáticos será substituída por um carrossel dinâmico de produtos destacados pelo admin.

## Changes

### 1. Renomear Tags
- `new_in` → `novos`
- `best_seller` → `mais_vendidos`
- `last_pieces` → `ultimas_pecas`
- `sale` → `promocoes`
- Nova tag: `principal` (só visível no admin)

### 2. Seção "Principais" na HomePage
- Renomear "Nossas Categorias" para "Principais"
- Trocar grid de links estáticos por produtos dinâmicos filtrados por tag `principal`
- Desktop: carrossel horizontal (Embla Carousel), 4 por vez, com setas
- Mobile: grid 2 colunas (sem carrossel), mostrando todos os produtos

### 3. Seed
- Recriar seed com tags novas (sem script de migração)

## Scope
- Backend: model, schemas (Literal types)
- Frontend: types, ProductCard, FilterSidebar, ProductDetailPage, AdminProductForm, HomePage
- Seed script
- Filtros rápidos: labels atualizados, continuam filtrando normalmente

## Non-goals
- Migração de dados existentes no banco (recriar seed)
- Mudar categorias ou slugs de URL
