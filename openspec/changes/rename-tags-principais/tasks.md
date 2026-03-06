# Tasks: Rename Tags + Seção Principais

## Renomear Tags

- [x] Atualizar Literal types em `backend/app/models/product.py` (novos, mais_vendidos, ultimas_pecas, promocoes, principal)
- [x] Atualizar Literal types em `backend/app/schemas/product.py` (ProductCreate, ProductUpdate, ProductFilters)
- [x] Atualizar tags no seed `backend/scripts/seed.py` e adicionar tag `principal` em alguns produtos
- [x] Atualizar `ProductTag` type em `frontend/src/types/product.ts`
- [x] Atualizar `.includes()` em `frontend/src/components/products/ProductCard.tsx`
- [x] Atualizar `.includes()` em `frontend/src/pages/ProductDetailPage.tsx`
- [x] Atualizar values/labels dos filtros em `frontend/src/components/products/FilterSidebar.tsx`
- [x] Atualizar `ALL_TAGS` em `frontend/src/pages/admin/AdminProductForm.tsx`

## Seção Principais na HomePage

- [x] Instalar `embla-carousel-react` no frontend (já no package.json)
- [x] Reescrever seção "Nossas Categorias" em `frontend/src/pages/HomePage.tsx`: titulo "Principais", buscar produtos com tag `principal`, carrossel Embla no desktop (4 visíveis), grid 2 colunas no mobile
