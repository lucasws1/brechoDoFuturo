Planejamento de rotas API

Páginas do app:

- Home / Catálogo
- Página do Produto
- Carrinho
- Checkout
- Login / Cadastro
- Painel do Usuário (Meus Pedidos)
- Painel do Admin (Gerenciar Produtos)
- Página de Contato

- Principais entidades:
  Produtos -> listar, criar, editar, deletar, visualizar
  Usuários -> listar, criar, editar, deletar, visualizar
  Pedidos -> listar, criar, editar, deletar, visualizar
  Usuários -> cadastro, login, mostrar dados (profile), listar pedidos

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

-> !Contato
A melhor e mais simples ideia é simplesmente linkar para uma mensagem no whatsapp
Rotas: redirect /contato
//Controller: ContactController
//Service: ContactService
