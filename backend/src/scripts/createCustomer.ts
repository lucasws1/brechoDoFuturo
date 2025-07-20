import { PrismaClient, UserType } from "../../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createCustomer() {
  try {
    console.log("🚀 Criando usuário cliente...");

    const customerEmail = "cliente@brechofuturo.com";
    let customerUser = await prisma.user.findUnique({
      where: { email: customerEmail },
    });

    if (!customerUser) {
      const hashedPassword = await bcrypt.hash("cliente123", 10);
      customerUser = await prisma.user.create({
        data: {
          name: "Cliente Teste",
          email: customerEmail,
          password: hashedPassword,
          type: UserType.Customer,
        },
      });
      console.log("✅ Usuário cliente criado:", customerUser.email);
    } else {
      console.log("✅ Usuário cliente já existe:", customerUser.email);
    }

    console.log("👤 Credenciais do cliente:");
    console.log("   Email: cliente@brechofuturo.com");
    console.log("   Senha: cliente123");
  } catch (error) {
    console.error("❌ Erro ao criar usuário cliente:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
createCustomer();
