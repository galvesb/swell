# Proposal: Update Navigation Menu

## What
Simplify the navigation menu from 8 items to 5, renaming some labels.

## Why
The current menu has too many items for the initial version. Keep it focused on the core categories.

## Changes
- **New In** → rename to **Novas Peças** (sem dropdown)
- **Ocasiões** → remover do menu (manter no banco)
- **Coleções** → remover do menu (manter no banco)
- **Best Sellers** → remover do menu (manter no banco)
- **Roupas** → manter (COM dropdown)
- **Últimas Peças** → manter (sem dropdown)
- **Sale** → rename to **Promoções** (sem dropdown)
- **Sobre** → manter (sem dropdown)

## Scope
- Frontend only (Header.tsx + MobileMenu.tsx)
- Categorias no banco permanecem intactas
- Mobile menu alerts ("novo!", "vai acabar!") mantidos nos itens correspondentes
