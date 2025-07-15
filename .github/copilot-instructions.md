# Brechó do Futuro - AI Coding Agent Instructions

## Project Overview

This is a MERN stack e-commerce platform for a second-hand clothing store ("Brechó do Futuro"). The backend uses TypeScript + Express + Prisma + MongoDB, while the frontend is planned with React.

## Critical Context for Immediate Productivity

### Database & Prisma Setup

- **Schema location**: `backend/prisma/schema.prisma` - defines MongoDB models with enums (UserType, OrderStatus, PaymentStatus, ProductStatus)
- **Generated client**: Custom output path `../generated/prisma` (not default location)
- **Connection status**: Database integration is **temporarily disabled** - Prisma imports are commented out in controllers
- **Key commands**: `pnpm prisma:generate`, `pnpm prisma:push`, `pnpm prisma:studio`

### Monorepo Structure & Package Management

- **Package manager**: PNPM with workspace config (`pnpm-workspace.yaml`)
- **Workspace pattern**: Backend/frontend separation with shared dependencies
- **Development**: Use `pnpm dev` (not npm/yarn) - runs nodemon with ts-node

### Authentication Architecture (Currently Scaffolded)

- **JWT implementation**: Located in `src/utils/jwt.ts` but disabled (returns "temp-token")
- **Middleware pattern**: `src/middleware/auth.ts` with TODO comments for Prisma integration
- **Controller pattern**: `src/controllers/authController.ts` - placeholder responses, no actual DB operations
- **Routes structure**: RESTful design in `src/routes/authRoutes.ts` with proper JSDoc

### MVC Pattern Implementation

- **Strict MVC adherence**: Follow existing `.cursor/rules/padrao-mvc.mdc` conventions
- **Controller naming**: Use `[entity]Controller.ts` pattern (e.g., `authController.ts`, `productController.ts`)
- **Response format**: Standardized `ApiResponse` type with success/error structure
- **Route organization**: Separate route files with middleware composition

### TypeScript & Type Safety

- **Custom types**: Defined in `src/types/index.ts` - includes User, Product, Order interfaces
- **Request extensions**: `AuthenticatedRequest` interface for middleware
- **Enum synchronization**: TypeScript types must match Prisma schema enums exactly

### File Upload & Static Assets

- **Upload directory**: `/uploads` served as static files via Express
- **Middleware**: Multer configuration in `src/middleware/upload.ts`
- **Image limits**: 10MB JSON/URL encoding limits set in app.ts

### Development Workflow Patterns

- **Error handling**: Consistent try/catch with standardized error responses
- **Environment**: `.env` file required with DATABASE_URL, JWT_SECRET, PORT variables
- **Hot reload**: nodemon + ts-node for development, TypeScript compilation for production

### Integration Points & Dependencies

- **CORS**: Configured for localhost:3000 (frontend) with credentials
- **bcryptjs**: Password hashing (imported but not yet implemented)
- **Express static**: Serves uploaded files from `/uploads` endpoint

### Immediate Development Priorities

1. **Database connection**: Uncomment Prisma imports once DATABASE_URL is configured
2. **JWT utilities**: Complete token generation/verification functions
3. **Controller implementations**: Remove TODO comments and add actual CRUD operations
4. **Frontend integration**: Build React components matching the wireframe in `projeto.md`

### API Design Patterns

- **Base routes**: `/api/auth`, `/api/products`, `/api/orders`, `/api/categories`
- **Health check**: `/health` endpoint for monitoring
- **Versioning**: API routes prefixed with `/api/`
- **Status codes**: Follow REST conventions (201 for creation, 401 for auth failures)

## Commands That Aren't Obvious

```bash
# Database operations (backend directory)
pnpm prisma:generate    # Regenerate client after schema changes
pnpm prisma:push       # Push schema to MongoDB without migrations
pnpm prisma:studio     # Visual database browser

# Development (backend directory)
pnpm dev              # Start with nodemon + ts-node
pnpm build && pnpm start  # Production build + start
```

## Project-Specific Conventions

- **Import paths**: Use relative imports, not absolute paths (no path mapping configured)
- **Error responses**: Always use `ApiResponse` type with success boolean
- **MongoDB IDs**: Use `@db.ObjectId` with `@default(auto())` pattern
- **Controller exports**: Named exports, not default exports
- **Route documentation**: Include JSDoc comments with @route, @desc, @access
