import app from "./app";

const PORT = process.env.PORT || 3001;

// Função para iniciar o servidor
const startServer = async () => {
  try {
    // TODO: Conectar ao banco de dados
    // await prisma.$connect();
    // console.log('✅ Conectado ao MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📱 Ambiente: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

// Tratamento de sinais para encerramento gracioso
process.on("SIGTERM", async () => {
  console.log("🔄 Recebido SIGTERM, encerrando servidor...");
  // TODO: Desconectar do banco
  // await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🔄 Recebido SIGINT, encerrando servidor...");
  // TODO: Desconectar do banco
  // await prisma.$disconnect();
  process.exit(0);
});

startServer();
