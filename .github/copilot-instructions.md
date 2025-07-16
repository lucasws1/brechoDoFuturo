# Brechó do Futuro - AI Coding Agent Instructions

## Visão Geral

Este projeto é um e-commerce de brechó (roupas usadas) com backend em TypeScript, Express, Prisma e MongoDB. O frontend ainda não está implementado.

## Estrutura e Convenções (Backend)

- **Padrão MVC**: Siga rigorosamente o padrão descrito em `.cursor/rules/padrao-mvc.mdc`.

  - `src/models/`: entidades e lógica de negócio
  - `src/controllers/`: orquestração, validação, resposta
  - `src/routes/`: definição de rotas RESTful, sempre com JSDoc
  - `src/middleware/`: autenticação, upload, validação
  - `src/types/`: tipos TypeScript (User, Product, Order, etc.)
  - `src/utils/`: helpers (ex: JWT)
  - `src/config/`: configurações (ex: database)

- **Controllers**: Use sempre named exports. Nomeie como `[entidade]Controller.ts`.
- **Models**: Nomeie como a entidade (`User`, `Product`, ...). Lógica de negócio e validação ficam aqui.
- **Rotas**: Separe por entidade, use middlewares e documente com JSDoc.
- **Respostas**: Use sempre o tipo `ApiResponse` (success, data, error).
- **Enums**: Defina e sincronize com o schema Prisma (`backend/prisma/schema.prisma`).
- **IDs**: Use `@db.ObjectId` e `@default(auto())` no Prisma.

## Fluxo de Desenvolvimento

- **Banco de dados**: Integração Prisma/MongoDB está temporariamente desabilitada (imports comentados). Reative após configurar o `.env`.
- **JWT**: Utilitário em `src/utils/jwt.ts` (atualmente placeholder). Implemente geração/validação real.
- **Uploads**: Use Multer (`src/middleware/upload.ts`). Arquivos vão para `/uploads` (servido como estático).
- **Limites**: JSON e uploads limitados a 10MB.
- **CORS**: Permitido apenas para `localhost:3000`.
- **Senhas**: Use `bcryptjs` para hash (ainda não implementado).
- **Variáveis de ambiente**: `.env` com `DATABASE_URL`, `JWT_SECRET`, `PORT`.
- **Comandos principais**:
  - `pnpm dev` (hot reload, nodemon + ts-node)
  - `pnpm prisma:generate`, `pnpm prisma:push`, `pnpm prisma:studio`
  - `pnpm build && pnpm start` (produção)

## Padrões de API

- Prefixo `/api/` em todas as rotas
- Rotas principais: `/api/auth`, `/api/products`, `/api/orders`, `/api/categories`
- Endpoint `/health` para monitoramento
- Status HTTP RESTful (201 criação, 401 auth, etc.)

## Outras Observações

- **Importe sempre por caminhos relativos** (sem path mapping)
- **Frontend**: ainda não implementado, mas siga o padrão sugerido em `.cursor/rules/padrao-mvc.mdc` quando iniciar
- **Sempre consulte `.cursor/rules/padrao-mvc.mdc` para exemplos e regras detalhadas**
