# Copilot Instructions for Brechó do Futuro (Full Stack)

## Project Overview

- **Type:** Full stack e-commerce application (backend implemented, frontend not started)
- **Stack:** Node.js, TypeScript, Express, Prisma (MongoDB), JWT, Multer, CORS
- **Pattern:** Strict MVC (Model-View-Controller) with clear separation of concerns (backend)

## Key Architectural Patterns

- **Controllers** (`src/controllers/`): Handle HTTP, basic validation, call services, return standardized responses (`{ data, error, message }`).
- **Services** (`src/services/`): Business logic, complex validation, orchestration, call models.
- **Models** (future, `src/models/`): Direct DB access via Prisma. Use pure functions, not classes.
- **Routes** (`src/routes/`): Express route definitions, grouped by resource (e.g., `/api/products`).
- **Middleware** (`src/middleware/`): Auth, upload, error handling, etc.
- **Utils** (`src/utils/`): JWT, error helpers, etc.
- **Types** (`src/types/`): Shared TypeScript types for all layers.

## Developer Workflows

- **Install:** `pnpm install`
- **Dev server:** `pnpm dev`
- **Build:** `pnpm build`
- **Production:** `pnpm start`
- **Prisma Client:** `pnpm prisma:generate`
- **DB Sync:** `pnpm prisma:push`
- **Prisma Studio:** `pnpm prisma:studio`
- **Env setup:** Copy `.env.example` to `.env` and edit as needed.

## API & Auth

- All protected routes require JWT in `Authorization: Bearer <token>` header.
- RESTful endpoints grouped by resource (see `README.md` for full list).
- File uploads served from `/uploads`.

## Project Conventions

- **No classes for models:** Use pure functions for DB access.
- **Validation:** Basic in controllers, business rules in services.
- **Consistent responses:** Always return `{ data, error, message }` from controllers.
- **Types:** Use shared types from `src/types/`.
- **Entities:** Defined in `entidades.json` and `prisma/schema.prisma`.
- **Error handling:** Centralized error middleware in `app.ts`.
- **Not found:** 404 handler for unmatched routes in `app.ts`.

## Examples

- See `.cursor/rules/padrao-mvc.mdc` for detailed MVC flow and code samples.
- Example product creation flow:
  1. Route: `POST /api/products`
  2. Controller: Validates, calls `ProductService.createProduct`
  3. Service: Business rules, calls model
  4. Model: `prisma.product.create`
  5. Controller: Returns HTTP response

## Integration Points

- **Prisma**: ORM for MongoDB, schema in `prisma/schema.prisma`.
- **JWT**: Auth utilities in `src/utils/auth.ts`.
- **Uploads**: Handled by Multer middleware, static files in `/uploads`.

---

> For more details, see `backend/README.md` and `.cursor/rules/padrao-mvc.mdc`.
> Follow the MVC separation and response conventions strictly.
