# Proposta: Migração Swell Store — Static → Full-Stack Seguro

## Resumo

Migrar o protótipo estático `index.html` da **Swell Store** (loja de moda feminina) para uma aplicação full-stack moderna, dinâmica e segura. A nova aplicação será composta por um frontend React (Vite + TailwindCSS) fiel ao design original, um backend FastAPI assíncrono estruturado em Clean Architecture, e um banco de dados MongoDB com Motor. Todo o sistema rodará via Docker Compose.

## Motivação

O `index.html` atual é apenas um protótipo visual estático. Não há persistência de dados, autenticação, gerenciamento de estoque, painel administrativo ou segurança. Para que a Swell se torne uma loja operacional, é necessário:

- **Catálogo dinâmico**: produtos gerenciados no banco, com filtros, paginação e busca.
- **Autenticação segura**: login com hash de senha, tokens JWT em cookies `HttpOnly`.
- **Carrinho funcional**: persistido no servidor para usuários autenticados, com suporte a guest via `localStorage` e merge ao logar.
- **Painel Admin (RBAC)**: apenas usuários com `role=admin` podem criar, editar e excluir produtos com upload de imagens.
- **Segurança AppSec**: mitigação das vulnerabilidades OWASP Top 10.

## O que será entregue

- Frontend React com fidelidade visual ao `index.html` (cores, fontes, layout, responsividade).
- Backend FastAPI com camadas separadas: routers, services, repositories, schemas.
- MongoDB com collections: `users`, `products`, `cart_items`, `categories`.
- Autenticação JWT: access token em memória (Zustand), refresh token em cookie `HttpOnly`.
- RBAC: roles `customer` e `admin`.
- Upload de imagens: arquivos locais em `/uploads/` servidos pelo Nginx (MVP).
- Filtros dinâmicos: categoria, preço, tamanho, cor, tag; ordenação por preço, data, relevância.
- Paginação server-side com `skip` e `limit`.
- Rate limiting em rotas de autenticação.
- Docker Compose com 4 serviços: nginx, backend, frontend, mongo.

## Fora do escopo (MVP)

- Checkout e pagamento.
- Histórico de pedidos.
- Wishlist persistida no servidor (fica em `localStorage`).
- Integração com AWS S3 (planejada como extensão futura).
- Envio de e-mail (recuperação de senha, confirmações).

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS + Zustand + React Router v6 |
| Componentes de UI | Embla Carousel, Phosphor Icons |
| Backend | Python 3.12 + FastAPI (assíncrono) |
| ORM/ODM | Beanie (Motor async) |
| Banco de dados | MongoDB 7 |
| Segurança | passlib[bcrypt], python-jose, SlowAPI, python-secure |
| Containers | Docker + Docker Compose + Nginx |
