# Repository Guidelines

## Project Structure & Module Organization
- `backend/` provides the Express + Prisma API; keep request flow in `src/` (controllers → services → utils) and persist models under `prisma/`.
- `frontend/` delivers the Vite + React UI; organize features inside `src/` by responsibility (`pages/`, `components/`, `contexts/`, `services/`, `utils/`).
- Treat each `dist/` as disposable output. Author content in `src/`, keep reference material in `docs/`, and serve static assets from `frontend/public/`.

## Build, Test, and Development Commands
- Install dependencies per workspace: `cd backend && pnpm install`, `cd frontend && pnpm install`.
- Backend: `pnpm dev` (tsx watch server), `pnpm build` (TypeScript → `dist/`), `pnpm start` (run compiled server).
- Frontend: `pnpm dev` (Vite + HMR), `pnpm build` (production bundle), `pnpm preview` (serve build), `pnpm lint` (ESLint pass).
- Database utilities (`backend/`): `pnpm prisma:generate`, `pnpm prisma:push`, `pnpm seed:categories`, `pnpm seed:products`.

## Coding Style & Naming Conventions
- TypeScript first: declare return types on public functions and use async/await, not raw Promises.
- Keep the 2-space indentation, Prettier defaults, and Tailwind ordering enforced by `prettier-plugin-tailwindcss`.
- Components, providers, and hooks use PascalCase (`CartProvider`, `useAuth`); helpers stay camelCase (`parseQuery.ts`).
- Access environment values through config wrappers (`backend/src/config/prisma.ts`, `frontend/src/lib/**`) instead of touching `process.env` inline.

## Testing Guidelines
- No automated suite is wired yet; when adding logic, colocate tests (`*.test.ts` or `*.test.tsx`) beside the source module.
- Prefer Vitest + Testing Library for React layers and Jest-style tooling for API services; stub external APIs (shipping, auth) for deterministic runs.
- Until coverage exists, document manual verification steps in the PR and run both `pnpm dev` servers before approval.

## Commit & Pull Request Guidelines
- Follow the repo’s Conventional Commit habit: `feat:`, `fix:`, `chore:`, `refactor:` + imperative summary (`feat: add shipping quote modal`).
- Scope PRs narrowly, describe context and test evidence, attach UI screenshots when visuals change, and link the tracking issue.
- Call out schema or seed updates in the PR body so reviewers can rerun the relevant Prisma commands.

## Environment & Data Notes
- Copy `backend/.env.example` to `.env`, then supply MongoDB, JWT, and Melhor Envio credentials before running seeds or `pnpm dev`.
- Prisma targets MongoDB; after editing `prisma/schema.prisma`, regenerate clients and confirm the `DATABASE_URL` is correct.
- Keep static files in `frontend/public/` with lowercase-kebab-case names and import them via `/assets/...` paths in React.
