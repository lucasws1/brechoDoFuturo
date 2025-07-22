Planejamento de rotas API

Páginas do app:

- ✅ Home / Catálogo (Concluído)
- ✅ Página do Produto (Concluído)
- ✅ Carrinho (Concluído)
- ✅ Checkout (Concluído)
- ✅ Login / Cadastro (Concluído)
- ✅ Painel do Usuário (Meus Pedidos) (Concluído)
- ✅ Painel do Admin (Gerenciar Produtos) (Concluído)
- ✅ Página de Contato (Concluído)

- Principais entidades:
  Produtos -> listar, criar, editar, deletar, visualizar
  Usuários -> cadastro, login, mostrar dados (profile), listar pedidos
  Pedidos -> listar, criar, editar, deletar, visualizar

-> Produtos

- Rotas:
  GET /api/products — listar produtos (catálogo)
  GET /api/products/:id — detalhes do produto
  POST /api/products — criar produto (admin)
  PUT /api/products/:id — editar produto (admin)
  DELETE /api/products/:id — excluir produto (admin)
- Controller: ProductController (com funções para cada ação acima)
- Service: ProductService (faz as operações no banco)

-> Usuários

- Rotas:
  POST /api/auth/register — cadastro
  POST /api/auth/login — login
  GET /api/users/me — pegar dados do usuário logado
  GET /api/users/orders — listar pedidos do usuário
- Controller: AuthController e UserController
- Service: AuthService, UserService

-> Pedidos

- Rotas:
  POST /api/orders — criar pedido (checkout)
  GET /api/orders/:id — ver detalhes do pedido
  GET /api/orders — listar pedidos (admin pode ver todos, user vê os dele)
- Controller: OrderController
- Service: OrderService

-> !Carrinho
Não quero persistência, então ficará no frontend (localStorage).
Possibilidade de voltar no assunto se essa não se mostrar a melhor opção.

-> ✅ Contato (Concluído)
A página de contato foi implementada com:
- Formulário de contato completo
- Integração com WhatsApp para mensagens diretas
- Informações da empresa (endereço, telefone, email)
- Horário de funcionamento
- Links para redes sociais
- Navegação integrada no header
Implementação: ContactPage.tsx com integração WhatsApp e formulário funcional
