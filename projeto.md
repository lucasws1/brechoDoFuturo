1. Páginas:

- Home / Catálogo
- Página do Produto
- Carrinho
- Checkout
- Login / Cadastro
- Painel do Usuário (Meus Pedidos)
- Painel do Admin (Gerenciar Produtos)
- Página de Contato
  Funcionalidades chave:
- CRUD completo no painel do admin
- Processo de compra do cliente (do catálogo ao checkout)
- Checkout com frete fixo ou a combinar por enquanto
- Exibição de pedidos para o cliente e para o admin

2. Entidades = já definidas em arquivo .json conforme falamos.
3. (no final do arquivo)
4. Visual = cores, tipografia, estilo dos elementos, espaçamento e imagens
   Radix e shadcn.
5. Código
   5.1. Backend:

- APIs = funcionalidades, passo 1
- Modelos do Mongo = entidades, passo 2
  5.2. Frontend:
- Estrutura das páginas = wireframe
- Visual = estilo

3. Wireframes = layout, estrutura, fluxo, conteúdo
   Home:
   +-------------------------------------------------------------------------------------+
   | [LOGO] [Barra de Busca] [Entrar/Cadastrar] [Carrinho] |
   +-------------------------------------------------------------------------------------+
   | [Menu de categorias na vertical] | [Grid de Produtos] |
   | | +----------------+ +----------------+ |
   | - Todas | | [IMAGEM] | | [IMAGEM] | |
   | - Vestidos | | Nome do produto| | Nome do produto| |
   | - Camisas | | Preço | | Preço | |
   | - Calças | | [Adicionar] | | [Adicionar] | |
   | - ... | +----------------+ +----------------+ |
   | | ... (mais produtos em grid) |
   +-------------------------------------------------------------------------------------+
   | [Paginação ou botão "Carregar mais"] |
   +-------------------------------------------------------------------------------------+
   | [Rodapé: links, contato, redes sociais] |
   +-------------------------------------------------------------------------------------+
   Página do produto:
   +----------------------------------------------------------------------------+
   | [LOGO] [Barra de Busca] [Entrar/Cadastrar] [Carrinho] |
   +----------------------------------------------------------------------------+
   | |
   | [IMAGEM GRANDE DO PRODUTO] [Nome do Produto] |
   | [Miniaturas/galeria de imagens] [Preço] |
   | [Descrição curta] |
   | [Botão: Adicionar ao Carrinho] [Categoria(s)] |
   | [Vendedor (opcional)] |
   | [Status: Disponível/Vendido] |
   | [Quantidade: [ - 1 + ]] |
   | |
   | ----------------------------------- |
   | [Descrição detalhada do produto] |
   | |
   | ----------------------------------- |
   | [Avaliações dos clientes] |
   | (Exemplo: estrelas, comentário, nome do usuário, data) |
   | |
   +----------------------------------------------------------------------------+
   | [Rodapé: contato, links, redes sociais] |
   +----------------------------------------------------------------------------+
   Carrinho:
   +----------------------------------------------------------------------------+
   | [LOGO] [Barra de Busca] [Entrar/Cadastrar] [Carrinho] |
   +----------------------------------------------------------------------------+
   | |
   | [Título: Meu Carrinho] |
   | |
   | +-----------------------------------------------------------+ |
   | | Produto | Nome | Preço | Quantidade | Subtotal | Remover | |
   | +-----------------------------------------------------------+ |
   | | [img] | Camisa X | R$ 40 | [ - 2 + ] | R$ 80 | (X) | |
   | | [img] | Calça Y | R$ 60 | [ - 1 + ] | R$ 60 | (X) | |
   | +-----------------------------------------------------------+ |
   | |
   | [Total: R$ 140] |
   | [Botão: Finalizar Compra] [Botão: Continuar Comprando] |
   | |
   | [Mensagem sobre frete] (ex: "Frete será calculado no checkout") |
   +----------------------------------------------------------------------------+
   | [Rodapé: contato, links, redes sociais] |
   +----------------------------------------------------------------------------+
