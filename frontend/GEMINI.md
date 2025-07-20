## Project Overview

- **Stack:** React + TypeScript + Vite, TailwindCSS, shadcn/ui, Zod, React Router DOM, React Hook Form, clsx, pnpm
- **Architecture:**
  - `src/components/ui/`: Design system (atomic, accessible, Radix-based components)
  - `src/components/`: App-specific components (e.g., `ProductCard`, `Header`, `Footer`)
  - `src/pages/`: Route-level pages (e.g., `Home.tsx`)
  - `src/layouts/`: Layout wrappers (e.g., `MainLayout.tsx`)
  - `src/lib/`: Utilities and mock data (e.g., `mockProducts.ts`, `utils.ts`)
  - `src/assets/`, `src/styles/`, `src/types/`: Static assets, global styles, and TypeScript types

## Key Patterns & Conventions

- **UI Components:**
  - All UI primitives are in `src/components/ui/` and follow shadcn/ui conventions (Radix, `cn` for class merging, data-slot attributes for styling).
  - Use atomic components to compose higher-level features (see `ProductCard`, `Header`, `Footer`).
- **Styling:**
  - TailwindCSS is the primary styling method. Custom theme variables are defined in `src/index.css`.
  - Use the `cn` utility from `src/lib/utils.ts` for merging class names.
- **Mock Data:**
  - Product data for development is in `src/lib/mockProducts.ts`.
- **Page Layout:**
  - Pages are composed using global layout (`MainLayout.tsx`), header, footer, and grid containers.
  - Home page (`src/pages/Home.tsx`) demonstrates the product grid and "Ver mais" button pattern.
- **State Management:**
  - State for cart, categories, and pagination is intended to be managed via React Context or similar (see `fluxo_frontend.txt`).
  - Cart is frontend-only (localStorage), not persisted to backend.
- **Routing:**
  - React Router DOM is used for client-side routing. Each file in `src/pages/` is a route.

## Developer Workflows

- **Install dependencies:** `pnpm install`
- **Start dev server:** `pnpm dev`
- **Build for production:** `pnpm build`
- **Lint:** ESLint config in `eslint.config.js` (see `frontend/README.md` for type-aware setup)
- **Type checking:** Uses TypeScript (`tsconfig.json`, `tsconfig.app.json`)

## Integration Points

- **Design System:** All new UI elements should be built in `src/components/ui/` and reused across the app.
- **External APIs:** No direct backend integration in frontend yet; product/catalog data is mocked.
- **Theming:** Theme tokens and dark mode are managed via CSS custom properties in `src/index.css`.

## Examples

- **Composing a product grid:** See `src/pages/Home.tsx` and `ProductCard` usage.
- **Adding a new UI primitive:** Follow the pattern in `src/components/ui/button.tsx` or `dialog.tsx`.
- **Global layout:** See `src/layouts/MainLayout.tsx` and `Header`/`Footer` components.

## References

- `fluxo_frontend.txt` and `projeto_v1.md` for architectural rationale and wireframes.
- `frontend/README.md` for ESLint and TypeScript config details.

---

If any section is unclear or missing, please provide feedback for further refinement.
