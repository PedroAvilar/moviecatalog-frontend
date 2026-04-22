# MovieCatalog – Frontend

Aplicação web responsiva para navegar em um catálogo completo de filmes.

> **Nota:** Este repositório contém o **Frontend**. Ele funciona em conjunto com seu **Backend For Frontend (BFF)** dedicado.

## Links do Projeto

- **Site em produção:** [Acessar o site](https://pedroavilar.github.io/moviecatalog-frontend/)
- **Repositório do Backend (BFF):** [moviecatalog-bff](https://github.com/pedroavilar/moviecatalog-bff)

## Sobre o Projeto

O MovieCatalog permite que os usuários naveguem por filmes populares, mais bem avaliados e categorizados por gênero. A plataforma possibilita favoritar títulos, explorar detalhes completos (incluindo elenco e informações de produção), escrever avaliações e gerenciá-las em uma página dedicada.

O frontend se comunica exclusivamente com o nosso **Backend For Frontend (BFF)** em vez de consumir APIs externas diretamente. O BFF cuida da agregação de dados, proxy da API do TMDB, cache e segurança — permitindo que este cliente seja mais rápido, seguro e focado apenas em interface e experiência do usuário.

O projeto é desenvolvido com foco rigoroso em responsividade e acessibilidade, tratando diferentes cenários de erro e estados de carregamento (skeletons) para garantir a melhor experiência ao usuário.

Este site utiliza dados do TMDB, mas não é endossado, certificado ou aprovado pelo TMDB.  
<img src="src/assets/logotipo-tmdb.svg" alt="Logotipo TMDB." width="100px">

### Funcionalidades

- **Autenticação** – Cadastro e login de usuários com feedback visual via Toast.
- **Rotas protegidas** – Páginas de favoritos, avaliações e perfil acessíveis apenas por usuários autenticados (`ProtectedRoute`).
- **Navegação por gêneros** – Scroll infinito na listagem de filmes por categoria com `IntersectionObserver`.
- **Detalhes do filme** – Página completa com sinopse, elenco, pôster e backdrop.
- **Favoritos** – Adicionar e remover filmes dos favoritos com atualização imediata da UI.
- **Avaliações (Reviews)** – Criar e excluir avaliações de filmes diretamente na página de detalhes; listagem completa na página "Minhas Avaliações".
- **Perfil** – Página de perfil do usuário autenticado.
- **Toast notifications** – Feedback contextual de sucesso e erro em todas as ações do usuário via `ToastContext`.
- **Estados de carregamento** – Skeletons padronizados e centralizados em todas as páginas e componentes.
- **Tratamento de erros** – Componente `ErrorMessage` dedicado para exibição de erros de rede e de API.
- **Estado vazio** – Componente `EmptyState` para listagens sem resultados.
- **Validação de formulários** – Validação com Zod e React Hook Form em todos os formulários (login, cadastro e avaliações).

### Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis (Header, Footer, Modal, Toast, etc.)
├── context/          # Contextos globais: AuthContext e ToastContext
├── pages/            # Páginas da aplicação (Home, Categories, Favorites, etc.)
├── schemas/          # Schemas de validação Zod (auth, review)
├── services/         # Camada de comunicação HTTP com o BFF (apiService.js / Axios)
├── styles/           # Estilos globais e utilitários CSS
└── utils/            # Utilitários: slugify, getPosterUrl, getBackdrop, getProfileUrl, Icons
```

## Deploy

O frontend é compilado de forma estática e hospedado no **GitHub Pages**, garantindo entrega rápida e segura via HTTPS. Ele se comunica com a API do BFF em produção (hospedada no Render), com configuração adequada de CORS e gerenciamento seguro de credenciais.

## Tecnologias

- [Vite](https://vitejs.dev/)
- [React 19](https://react.dev/)
- [React Router Dom](https://reactrouter.com/)
- [TanStack React Query](https://tanstack.com/query) (Gerenciamento de estado assíncrono e cache do cliente)
- [React Hook Form](https://react-hook-form.com/) (Gerenciamento de formulários)
- [Zod](https://zod.dev/) (Validação de schemas)
- [Axios](https://axios-http.com/)
- [react-intersection-observer](https://github.com/thebuilder/react-intersection-observer) (Scroll infinito)
- [GitHub Pages](https://pages.github.com/) (Hospedagem)

## Instalação e Configuração

Para executar a aplicação localmente com funcionalidade completa, é recomendado ter o BFF em execução também.

1. **Instalar dependências:**

   ```bash
   npm install
   ```

2. **Configuração do ambiente:**
   Certifique-se de ter as variáveis de ambiente corretas mapeando as requisições para a instância local do BFF (ex.: `http://localhost:3000`).

3. **Executar o projeto:**
   ```bash
   npm run dev
   ```

> Para instruções de configuração do backend, acesse o [Repositório do BFF](https://github.com/pedroavilar/moviecatalog-bff).

## Status do Projeto

Este projeto está atualmente em **desenvolvimento ativo**.

---

# MovieCatalog – Frontend

A responsive web application for browsing a comprehensive movie catalog.

> **Note:** This repository contains the **Frontend** application. It works in conjunction with its dedicated **Backend For Frontend (BFF)**.

## Project Links

- **Live Site:** [View live site](https://pedroavilar.github.io/moviecatalog-frontend/)
- **Backend (BFF) Repository:** [moviecatalog-bff](https://github.com/pedroavilar/moviecatalog-bff)

## About the Project

MovieCatalog allows users to browse popular, top-rated, and genre-categorized movies. The platform allows users to favorite titles, explore complete details (including cast and production information), write reviews, and manage them on a dedicated page.

The frontend communicates exclusively with our custom **Backend For Frontend (BFF)** instead of consuming external APIs directly. The BFF handles data aggregation, TMDB API proxying, caching, and security — allowing this client to be faster, more secure, and strictly focused on UI/UX.

The project is being developed with a strict focus on responsiveness and accessibility, addressing various error scenarios and loading states (skeletons) to ensure the best user experience.

This website uses TMDB data but is not endorsed, certified, or otherwise approved by TMDB.  
<img src="src/assets/logotipo-tmdb.svg" alt="TMDB logo." width="100px">

### Features

- **Authentication** – User registration and login with visual feedback via Toast notifications.
- **Protected Routes** – Favorites, reviews, and profile pages accessible to authenticated users only (`ProtectedRoute`).
- **Genre Browsing** – Infinite scroll on genre-based movie listings using `IntersectionObserver`.
- **Movie Details** – Full detail page with synopsis, cast, poster, and backdrop.
- **Favorites** – Add and remove movies from favorites with immediate UI updates.
- **Reviews** – Create and delete movie reviews directly on the details page; full listing on the "My Reviews" page.
- **Profile** – Authenticated user profile page.
- **Toast Notifications** – Contextual success and error feedback for all user actions via `ToastContext`.
- **Loading States** – Standardized, centralized skeletons across all pages and components.
- **Error Handling** – Dedicated `ErrorMessage` component for network and API errors.
- **Empty State** – `EmptyState` component for listings with no results.
- **Form Validation** – Zod + React Hook Form validation on all forms (login, register, and reviews).

### Project Structure

```
src/
├── components/       # Reusable components (Header, Footer, Modal, Toast, etc.)
├── context/          # Global contexts: AuthContext and ToastContext
├── hooks/            # Custom React hooks
├── pages/            # Application pages (Home, Categories, Favorites, etc.)
├── schemas/          # Zod validation schemas (auth, review)
├── services/         # HTTP communication layer with the BFF (apiService.js / Axios)
├── styles/           # Global styles and CSS utilities
└── utils/            # Utilities: slugify, getPosterUrl, getBackdrop, getProfileUrl, Icons
```

## Deployment

This frontend application is statically built and hosted on **GitHub Pages**, providing fast and secure delivery via HTTPS. It seamlessly communicates with the production BFF API (hosted on Render), ensuring proper CORS configuration and secure credential management.

## Technologies

- [Vite](https://vitejs.dev/)
- [React 19](https://react.dev/)
- [React Router Dom](https://reactrouter.com/)
- [TanStack React Query](https://tanstack.com/query) (Async state management and client-side cache)
- [React Hook Form](https://react-hook-form.com/) (Form management)
- [Zod](https://zod.dev/) (Schema validation)
- [Axios](https://axios-http.com/)
- [react-intersection-observer](https://github.com/thebuilder/react-intersection-observer) (Infinite scroll)
- [GitHub Pages](https://pages.github.com/) (Hosting)

## Installation and Setup

To run this application locally with full functionality, it's recommended to have the BFF running as well.

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Setup:**
   Ensure you have the proper environment variables mapping your API requests to your local BFF instance (e.g., `http://localhost:3000`).

3. **Run the project:**
   ```bash
   npm run dev
   ```

> For backend setup instructions, please visit the [BFF Repository](https://github.com/pedroavilar/moviecatalog-bff).

## Project Status

This project is currently **under active development**.
