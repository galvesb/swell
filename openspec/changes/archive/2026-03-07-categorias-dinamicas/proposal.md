# Categorias Dinamicas

## O que

Permitir que o admin cadastre categorias de produtos (ex: Vestidos, Blusas, Calcas, Saias) pela tela "Editar Site", e que essas categorias aparecam como filtro no sidebar da pagina de roupas.

## Por que

Hoje `Product.category` e hardcoded como "roupas" e as categorias no frontend sao estaticas no codigo. O admin nao tem como criar ou gerenciar categorias sem alterar o codigo-fonte. Isso limita a autonomia do usuario administrador.

## Escopo

### Incluido
- CRUD de categorias no admin (dentro de "Editar Site" como submenu)
- Endpoint publico para listar categorias
- Dropdown dinamico de categoria no formulario de produto
- Filtro por categoria no FilterSidebar da pagina de roupas
- Rota `/categoria/roupas` mostra TODOS os produtos (sem filtrar por category)
- Seed atualizado com categorias iniciais

### Excluido
- Categorias no header (NAV_LINKS ficam fixos)
- Hierarquia de categorias (sem subcategorias)
- Multiplas categorias por produto (1 produto = 1 categoria)

## Decisoes

1. Produto tem 1 categoria (string = slug da categoria)
2. Header NAV_LINKS permanecem fixos no codigo
3. Categorias aparecem apenas como filtro no sidebar de `/categoria/roupas`
4. "Editar Site" vira pagina com 2 submenus: Geral (config atual) + Categorias (CRUD)
5. `/categoria/roupas` nao filtra por category na API — mostra todos os produtos
6. O model `Category` ja existe no backend (slug, name, description, order)
