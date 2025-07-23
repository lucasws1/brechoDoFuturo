# Brechó do Futuro - ecommerce

## Projeto “brechoDoFuturo” - website de e-commerce.

#### Backend ok (por enquanto)

#### Fluxo do frontend:
1. **Setup do projeto e arquitetura básica**
    - Configure o bundler (Vite, CRA, Next.js, etc.), defina ESLint/Prettier, TypeScript (se aplicável) e estrutura de pastas (páginas, componentes, serviços, estilos).
    - Garanta a integração com seu design token ou biblioteca de estilos (Tailwind, Styled Components, CSS Modules…).
        
        OK - MERN stack - frontend: Vite, prettier, TS, react, tailwind, zod, react router dom, react hook form, clsx (lista não exaustiva).
        OK - Estrutura das páginas: assets, components, config, contexts, hooks, layouts, lib, pages, routes, styles, types
        
2. **Componentes compartilhados ("Design System")**
    - Comece criando os blocos mais atômicos: botão, input, cards de produto, tipografia e cores.
    - Assim, quando montar páginas, você já terá uma base consistente.
        
        OK: componentes shadcn.
        
3. **Layout global (Header / Footer / Grid container)**
    - Crie o `Header` com logo, busca, botões de login/cadastro e carrinho.
    - Defina o `Footer` com links e contatos.
    - Implemente o container ou sistema de grid que vai receber as páginas filhas.
        
        OK → header com pesquisa funcionando.
        Home com paginação.
        Contexto global para produtos implementado.
        Footer ok (mock).
        Estilo será aprimorado no final para não perder tempo. No momento, foco na implementação das funções.
        
4. **Home page**
    - Use seus componentes atômicos e o layout global para montar a Home:
        - Topbar de categorias
        - Grid de produtos (card de produto + botão de "Adicionar")
        - Paginação ou "Carregar mais"
        - Rodapé
        
        OK:
        
        - Topbar com pesquisa e categorias.
        - Grid com produtos.
        - Paginação ok (carregar mais e números por enquanto, ajustar no final).
        - Rodapé - design ok, aprimoramentos no final.
        - Vou substituir o botão 'adicionar' por 'menu do administrador' ou equivalente, sem urgência no momento.

4.1. Páginas a serem criadas:

- Home / Catálogo - ok
- Página do Produto - ok, useProductById
- Carrinho - CartContext - ok
- Checkout - ok
- Login / Cadastro - ok
- Painel do Usuário (Meus Pedidos) - ok
- Painel do Admin (Gerenciar Produtos) - Ok
- Página de Contato - ok

Implementações futuras:

Carrinho:
1. Mini-Carrinho (Popover): Em vez de ir direto para a página, um clique (ou hover) no ícone do carrinho poderia abrir um pequeno resumo flutuante, com link para a página completa.

Autenticação
Checklist final para JWT:
- JWT gerando e validando corretamente? - ok
- Rotas protegidas só acessam com token? - ok (testes realizados só no backend)
- Frontend armazena e envia token corretamente? - ok
- Logout limpa token do lado do cliente? - ok
- Refresh token implementado? - ok
