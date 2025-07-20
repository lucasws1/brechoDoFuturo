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

## Development Log & Next Steps

**Objective:** Build a full-featured e-commerce frontend for "Brechó do Futuro".

**Progress So Far:**

1.  **Home Page (`/`):** Completed. Displays a paginated catalog of products fetched from a mock API. Uses `ProductsContext` to manage state.
2.  **Product Page (`/product/:id`):** Completed. Displays detailed information for a single product. Uses a dedicated `useProductById` hook.
3.  **Shopping Cart (`/cart`):** Completed. Manages cart state using `CartContext` and persists data to `localStorage`. Allows users to view, update quantities, and remove items.
4.  **Checkout Page (`/checkout`):** Completed (UI & Mock Logic). Provides a complete, validated checkout form using `react-hook-form` and `zod`. Simulates the order placement process.

**Current Status & Next Step:**

The frontend currently operates in a mocked environment. The user has confirmed that a backend with JWT authentication is ready for integration.

-   **Next Major Task:** Implement **User Authentication (Login/Register)** by connecting the frontend to the existing backend API.
    -   **Plan:**
        1.  Switch to a project view that includes both `frontend` and `backend` directories.
        2.  Analyze backend authentication routes (`/login`, `/register`, `/refresh`) to understand API contracts.
        3.  Create a real `AuthContext` to manage user state and tokens.
        4.  Build an `AuthPage` with Login and Register forms that call the backend.
        5.  Implement protected routes for user-specific pages.

If any section is unclear or missing, please provide feedback for further refinement.