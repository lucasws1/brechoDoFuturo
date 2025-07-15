# Backend - Brechó do Futuro

Backend do projeto de e-commerce "Brechó do Futuro" desenvolvido em Node.js com TypeScript.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem principal
- **Express** - Framework web
- **Prisma** - ORM para MongoDB
- **MongoDB** - Banco de dados NoSQL
- **JWT** - Autenticação stateless
- **bcryptjs** - Criptografia de senhas
- **Multer** - Upload de arquivos
- **CORS** - Cross-Origin Resource Sharing

## 📁 Estrutura do Projeto

```
src/
├── config/          # Configurações (database, etc.)
├── controllers/     # Controladores da aplicação
├── middleware/      # Middlewares personalizados
├── models/          # Modelos de dados (futuramente)
├── routes/          # Definição das rotas
├── types/           # Tipos TypeScript
├── utils/           # Utilitários e helpers
├── app.ts           # Configuração do Express
└── server.ts        # Ponto de entrada da aplicação
```

## 🔧 Configuração

1. **Instalar dependências:**

   ```bash
   pnpm install
   ```

2. **Configurar variáveis de ambiente:**

   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` com suas configurações:

   ```
   DATABASE_URL="mongodb://localhost:27017/brechoDoFuturo"
   JWT_SECRET="your-super-secret-jwt-key-here"
   PORT=3001
   ```

3. **Gerar Prisma Client:**

   ```bash
   pnpm prisma:generate
   ```

4. **Sincronizar banco de dados:**
   ```bash
   pnpm prisma:push
   ```

## 🏃‍♂️ Executando

### Desenvolvimento

```bash
pnpm dev
```

### Produção

```bash
pnpm build
pnpm start
```

## 📋 Scripts Disponíveis

- `pnpm dev` - Inicia o servidor em modo desenvolvimento
- `pnpm build` - Compila o TypeScript para JavaScript
- `pnpm start` - Inicia o servidor em modo produção
- `pnpm prisma:generate` - Gera o Prisma Client
- `pnpm prisma:push` - Sincroniza o schema com o banco
- `pnpm prisma:studio` - Abre o Prisma Studio

## 🔗 Rotas da API

### Autenticação (`/api/auth`)

- `POST /register` - Registrar novo usuário
- `POST /login` - Login do usuário
- `GET /profile` - Obter perfil do usuário logado
- `POST /logout` - Logout do usuário

### Produtos (`/api/products`)

- `GET /` - Listar produtos (com filtros)
- `GET /:id` - Obter produto por ID
- `POST /` - Criar novo produto (admin)
- `PUT /:id` - Atualizar produto (admin)
- `DELETE /:id` - Deletar produto (admin)

### Categorias (`/api/categories`)

- `GET /` - Listar categorias
- `POST /` - Criar categoria (admin)
- `PUT /:id` - Atualizar categoria (admin)
- `DELETE /:id` - Deletar categoria (admin)

### Pedidos (`/api/orders`)

- `GET /` - Listar pedidos do usuário
- `POST /` - Criar novo pedido
- `GET /:id` - Obter pedido por ID
- `PUT /:id/status` - Atualizar status do pedido (admin)

### Carrinho (`/api/cart`)

- `GET /` - Obter carrinho do usuário
- `POST /items` - Adicionar item ao carrinho
- `PUT /items/:id` - Atualizar quantidade do item
- `DELETE /items/:id` - Remover item do carrinho

## 🛡️ Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer <seu-jwt-token>
```

## 📝 Status do Projeto

- ✅ Estrutura básica do projeto
- ✅ Configuração do Prisma
- ✅ Middlewares básicos
- ✅ Controllers de autenticação e produtos
- ⏳ Integração completa com banco de dados
- ⏳ Implementação completa dos CRUDs
- ⏳ Testes unitários
- ⏳ Documentação da API (Swagger)

## 🐛 Problemas Conhecidos

- Alguns imports do Prisma Client precisam ser corrigidos
- JWT utilities precisam de ajustes de tipagem
- Middleware de upload tem warnings de tipagem

## 🤝 Contribuição

Este é um projeto pessoal de e-commerce. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request
