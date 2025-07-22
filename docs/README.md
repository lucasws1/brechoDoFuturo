# Documentação - Brechó do Futuro

Esta pasta contém toda a documentação do projeto de e-commerce "Brechó do Futuro".

## 📋 **Planejamento e Arquitetura**

### **Visão Geral do Projeto**
- [`projeto_v1.md`](./projeto_v1.md) - Especificação inicial e escopo do projeto
- [`entidades.json`](./entidades.json) - Definição das entidades e relacionamentos
- [`api_routes_brechoDoFuturo.json`](./api_routes_brechoDoFuturo.json) - Mapeamento completo das rotas da API

### **Planejamento de Interface**
- [`planejamento_páginas.md`](./planejamento_páginas.md) - Estrutura e funcionalidades das páginas
- [`planejamento_rotas.md`](./planejamento_rotas.md) - Roteamento e navegação
- [`planejamento_fluxo_frontend.md`](./planejamento_fluxo_frontend.md) - Fluxo de usuário no frontend
- [`planejamento_estético.md`](./planejamento_estético.md) - Diretrizes visuais e design system

## 🛠️ **Implementação e Recursos**

### **Painel Administrativo**
- [`ADMIN_PANEL.md`](./ADMIN_PANEL.md) - Documentação completa do painel admin
- [`ADMIN_FIXES.md`](./ADMIN_FIXES.md) - Correções e melhorias implementadas

### **Funcionalidades Específicas**
- [`CONTROLE_ESTOQUE.md`](./CONTROLE_ESTOQUE.md) - Sistema de controle de estoque

## 🎯 **Status do Projeto**

### **✅ Funcionalidades Implementadas**

#### **Frontend**
- ✅ Interface de catálogo com filtros
- ✅ Página detalhada do produto
- ✅ Sistema de carrinho de compras
- ✅ Processo de checkout
- ✅ Autenticação (login/cadastro)
- ✅ Painel do usuário (pedidos)
- ✅ Painel administrativo completo
- ✅ Página de contato
- ✅ Design responsivo

#### **Backend**
- ✅ API RESTful completa
- ✅ Autenticação JWT
- ✅ CRUD de produtos
- ✅ CRUD de usuários
- ✅ Sistema de pedidos
- ✅ Carrinho de compras
- ✅ Controle de estoque
- ✅ Sistema de categorias
- ✅ Middleware de segurança

#### **Banco de Dados**
- ✅ Schema Prisma completo
- ✅ Relacionamentos configurados
- ✅ Migrações funcionando
- ✅ Seeders para desenvolvimento

## 📁 **Estrutura Técnica**

### **Backend (`/backend`)**
```
src/
├── config/          # Configurações (database, etc.)
├── controllers/     # Controladores da aplicação
├── middleware/      # Middlewares personalizados
├── routes/          # Definição das rotas
├── services/        # Lógica de negócio
├── utils/           # Utilitários e helpers
├── app.ts           # Configuração do Express
└── server.ts        # Ponto de entrada
```

### **Frontend (`/frontend`)**
```
src/
├── components/      # Componentes reutilizáveis
├── contexts/        # Context providers
├── hooks/           # Hooks customizados
├── layouts/         # Layouts das páginas
├── pages/           # Páginas da aplicação
├── services/        # Serviços de API
├── types/           # Tipos TypeScript
└── styles/          # Estilos globais
```

## 🚀 **Tecnologias Utilizadas**

### **Backend**
- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem principal
- **Express** - Framework web
- **Prisma** - ORM para MongoDB
- **MongoDB** - Banco de dados NoSQL
- **JWT** - Autenticação stateless
- **bcryptjs** - Criptografia de senhas

### **Frontend**
- **React** - Library de interface
- **TypeScript** - Linguagem principal
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **React Router** - Roteamento
- **Axios** - Cliente HTTP

## 🔄 **Próximas Implementações**

### **Curto Prazo**
- [ ] Sistema de pagamento integrado
- [ ] Upload de imagens real
- [ ] Notificações push
- [ ] Relatórios avançados

### **Médio Prazo**
- [ ] Sistema de cupons
- [ ] Avaliações e comentários
- [ ] Chat em tempo real
- [ ] App mobile (React Native)

### **Longo Prazo**
- [ ] Machine Learning para recomendações
- [ ] Sistema de afiliados
- [ ] Marketplace multi-vendedor
- [ ] Integração com marketplaces externos

## 📞 **Contato e Suporte**

Para dúvidas sobre a documentação ou implementação:

- **Desenvolvedor**: Lucas Schuch
- **Email**: lucas.schuch@gmail.com
- **GitHub**: [@lucasws1](https://github.com/lucasws1)

---

**Última Atualização**: July 2025  
**Versão do Projeto**: 1.0.0  
**Status**: Em Desenvolvimento Ativo
