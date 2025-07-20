import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

async function testCategoryFilter() {
  console.log("=== Testando filtro de categoria ===");

  // Primeiro, vamos ver todas as categorias
  const categories = await prisma.category.findMany();
  console.log(
    "Categorias encontradas:",
    categories.map((c) => ({ id: c.id, name: c.name }))
  );

  // Vamos ver um produto com suas categorias
  const productWithCategories = await prisma.product.findFirst({
    include: {
      categories: true,
    },
  });
  console.log("Produto exemplo:", {
    id: productWithCategories?.id,
    name: productWithCategories?.name,
    categoryIds: productWithCategories?.categoryIds,
    categories: productWithCategories?.categories.map((c) => c.name),
  });

  // Agora vamos testar o filtro usando categoryIds (nova lógica)
  const femininoCategory = await prisma.category.findFirst({
    where: { name: { equals: "Feminino", mode: "insensitive" } },
  });

  console.log("Categoria Feminino encontrada:", femininoCategory?.id);

  const filteredProductsByIds = await prisma.product.findMany({
    where: {
      categoryIds: { has: femininoCategory?.id },
    },
    include: {
      categories: true,
    },
  });

  console.log(
    "Produtos filtrados por categoryIds 'Feminino':",
    filteredProductsByIds.length
  );
}

testCategoryFilter()
  .then(() => {
    console.log("Teste concluído");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Erro no teste:", e);
    process.exit(1);
  });
