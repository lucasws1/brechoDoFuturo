import { PrismaClient, UserType } from "../../generated/prisma";
import { mockProducts } from "../utils/mockProducts";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function populateDatabase() {
  try {
    console.log("🚀 Iniciando população do banco de dados...");

    // 1. Criar usuário admin se não existir
    const adminEmail = "admin@brechofuturo.com";
    let adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      adminUser = await prisma.user.create({
        data: {
          name: "Administrador",
          email: adminEmail,
          password: hashedPassword,
          type: UserType.Admin,
        },
      });
      console.log("✅ Usuário admin criado:", adminUser.email);
    } else {
      console.log("✅ Usuário admin já existe:", adminUser.email);
    }

    // 2. Verificar se já existem produtos
    const existingProducts = await prisma.product.count();
    if (existingProducts > 0) {
      console.log(
        `⚠️  Já existem ${existingProducts} produtos no banco. Pulando criação de produtos.`
      );
      return;
    }

    // 3. Criar produtos mock
    console.log("📦 Criando produtos mock...");
    const createdProducts = [];

    for (const mockProduct of mockProducts) {
      try {
        const product = await prisma.product.create({
          data: {
            name: mockProduct.name,
            description: mockProduct.description,
            price: mockProduct.price,
            images: [mockProduct.image], // Converter string para array
            status: "Available",
            sellerId: adminUser.id,
            categoryIds: [], // Por enquanto sem categorias
          },
        });
        createdProducts.push(product);
        console.log(`✅ Produto criado: ${product.name}`);
      } catch (error) {
        console.error(`❌ Erro ao criar produto ${mockProduct.name}:`, error);
      }
    }

    console.log(
      `🎉 População concluída! ${createdProducts.length} produtos criados.`
    );
    console.log("👤 Credenciais do admin:");
    console.log("   Email: admin@brechofuturo.com");
    console.log("   Senha: admin123");
  } catch (error) {
    console.error("❌ Erro durante a população do banco:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
populateDatabase();
