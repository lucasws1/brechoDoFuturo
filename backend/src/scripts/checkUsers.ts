import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log("🔍 Verificando usuários...");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        createdAt: true,
      },
    });

    console.log(`📊 Total de usuários encontrados: ${users.length}`);
    console.log("");

    users.forEach((user, index) => {
      console.log(`👤 Usuário ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nome: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Tipo: ${user.type}`);
      console.log(`   Criado em: ${user.createdAt.toISOString()}`);
      console.log("");
    });

    // Verificar se existe admin@brechodofuturo.com
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@brechodofuturo.com" },
    });

    if (adminUser) {
      console.log("✅ Usuário admin@brechodofuturo.com encontrado!");
      console.log(`   Nome: ${adminUser.name}`);
      console.log(`   Tipo: ${adminUser.type}`);
    } else {
      console.log("❌ Usuário admin@brechodofuturo.com NÃO encontrado!");
      console.log(
        "💡 Você pode criar um usuário admin manualmente ou usar o lucas.schuch@gmail.com que já existe."
      );
    }

    // Verificar usuários admin
    const admins = users.filter((user) => user.type === "Admin");
    console.log(`🔑 Administradores encontrados: ${admins.length}`);
    admins.forEach((admin) => {
      console.log(`   - ${admin.name} (${admin.email})`);
    });
  } catch (error) {
    console.error("❌ Erro ao verificar usuários:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
