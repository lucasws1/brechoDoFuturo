# Copilot Instructions for brechoDoFuturo (Fullstack)

## Project Overview

- **Monorepo:** `frontend/` (React + Vite + TypeScript), `backend/` (Node.js + Express + TypeScript + Prisma)
- **Frontend:**
  - Uses atomic design system (`src/components/ui/`), TailwindCSS, shadcn/ui, React Router DOM, React Context for state, and localStorage for cart.
  - Product/catalog data is mocked; no direct backend integration yet.
  - Key files: `src/pages/Home.tsx`, `src/components/ProductCard.tsx`, `src/layouts/MainLayout.tsx`, `src/lib/mockProducts.ts`.
- **Backend:**
  - Follows strict MVC (see `.cursor/rules/padrao-mvc.mdc`): controllers (HTTP/validation), services (business logic), models (Prisma DB access), optional repositories.
  - Uses Prisma ORM (MongoDB), JWT auth, and returns consistent response objects (`{ data, error, message }`).
  - Key files: `src/controllers/`, `src/services/`, `src/models/`, `prisma/schema.prisma`.

## Key Patterns & Conventions

- **Frontend:**
  - UI primitives in `src/components/ui/` (Radix, shadcn/ui conventions, `cn` for class merging).
  - TailwindCSS for styling; theme tokens in `src/index.css`.
  - State via React Context; see `AuthProvider`, `CartProvider`, `ProductsProvider` in `src/contexts/`.
  - Routing: All routes defined in `src/App.tsx` using React Router DOM.
- **Backend:**
  - Controllers validate input, call services, return HTTP responses.
  - Services handle business rules, call models, centralize validation.
  - Models are pure functions for DB access (no business logic, no classes).
  - Types are shared via `src/types/`.
  - RESTful routes grouped by resource (e.g., `/api/products`, `/api/users`).

## Developer Workflows

- **Install dependencies:** `pnpm install` (run in root, `frontend/`, or `backend/` as needed)
- **Frontend:**
  - Dev: `pnpm dev` | Build: `pnpm build` | Lint: `pnpm lint` | Type check: `pnpm tsc`
- **Backend:**
  - Dev: `pnpm dev` | Build: `pnpm build` | Start: `pnpm start`
  - Prisma: `pnpm prisma:generate`, `pnpm prisma:push`, `pnpm prisma:studio`
  - Env: Copy `.env.example` to `.env` and edit as needed

## Integration Points

- **Frontend ↔ Backend:** No direct integration yet; see `src/lib/mockProducts.ts` for mock data. API contract in `docs/api_routes_brechoDoFuturo.json`.
- **Design System:** All new UI elements go in `src/components/ui/`.
- **Entities:** Defined in `docs/entidades.json` and `backend/prisma/schema.prisma`.

## Examples

- **Frontend:**
  - Product grid: `src/pages/Home.tsx` + `ProductCard`
  - New UI primitive: `src/components/ui/button.tsx`
  - Layout: `src/layouts/MainLayout.tsx`, `Header`, `Footer`
- **Backend:**
  - Product creation: see `.cursor/rules/padrao-mvc.mdc` for controller/service/model flow
  - Consistent response: `{ data, error, message }` from controllers

## References

- `.cursor/rules/padrao-mvc.mdc` for backend architecture
- `frontend/.github/copilot-instructions.md` for UI conventions
- `docs/README.md` for project docs and planning
- `backend/README.md`, `frontend/README.md` for setup and scripts
