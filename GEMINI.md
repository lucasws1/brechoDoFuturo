Seguir as diretrizes:

1. Use TypeScript para todo o código.
2. Use o padrão de projeto MVC (Model-View-Controller).
3. Use o MongoDB como banco de dados.
4. Use Express para o backend.
5. Use React para o frontend.
6. Use tailwindcss para o estilo do frontend.
7. Use pnpm como gerenciador de pacotes.
8. Use o Prisma como ORM para o MongoDB.

Contexto Técnico do Backend: Projeto Brechó do Futuro (website de e-commerce pessoal)
Este documento resume as tecnologias e bibliotecas escolhidas para a construção do backend do projeto.

Ambiente e Framework
Node.js / Express: Base para o servidor, gerenciamento de rotas e middleware.

TypeScript: Linguagem principal do projeto, para garantir a segurança de tipos e um código mais robusto.

pnpm: Gerenciador de pacotes utilizado.

Banco de Dados
Prisma: ORM (Object-Relational Mapper) para modelagem dos dados, migrações e comunicação com o banco de dados.

Prisma Client: Cliente gerado automaticamente para executar queries de forma type-safe.

MongoDB: O banco de dados NoSQL escolhido, configurado como datasource no Prisma.

Autenticação e Segurança
JWT (jsonwebtoken): Para geração e validação de tokens de autenticação stateless, permitindo o login e o acesso a rotas protegidas.

bcryptjs: Para a criptografia (hashing) de senhas de usuários antes de salvá-las no banco de dados.

Funcionalidades Específicas
Multer: Middleware para o tratamento de uploads de arquivos, especificamente para as imagens dos produtos.

CORS (cors): Middleware para habilitar e configurar o Cross-Origin Resource Sharing, permitindo que a aplicação frontend acesse a API.

dotenv: Para o gerenciamento de variáveis de ambiente de forma segura (ex: URL do banco de dados, segredos do JWT).

Ferramentas de Desenvolvimento
ts-node e nodemon: Utilizados em conjunto para executar o servidor em TypeScript e reiniciá-lo automaticamente a cada alteração de código, agilizando o desenvolvimento.
