import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Lista de categorias que correspondem às da UI
  const categories = [
    "Novidades",
    "Ofertas",
    "Masculino",
    "Feminino",
    "Infantil",
  ];

  // Cria ou atualiza categorias no banco
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, description: name },
    });
  }

  // Obtém todas as categorias criadas
  const allCategories = await prisma.category.findMany();
  const categoryIds = allCategories.map((c) => c.id);

  // Busca todos os produtos e atribui categorias de forma mais inteligente
  const products = await prisma.product.findMany({
    select: { id: true, name: true },
  });

  // Mapeamento de palavras-chave para categorias
  const categoryMapping = {
    Masculino: [
      "camisa",
      "blazer",
      "jaqueta",
      "shorts",
      "tênis",
      "cinto",
      "relógio",
      "perfume masculino",
    ],
    Feminino: [
      "vestido",
      "saia",
      "blusa",
      "bolsa",
      "perfume feminino",
      "colar",
      "pulseira",
      "anel",
    ],
    Infantil: [], // pode adicionar produtos infantis específicos depois
    Ofertas: [], // será atribuído aleatoriamente a alguns produtos
    Novidades: [], // será atribuído aos produtos mais recentes
  };

  for (const product of products) {
    const productName = product.name.toLowerCase();
    const assignedCategories: string[] = [];

    // Atribuir categorias baseadas no nome do produto
    for (const [categoryName, keywords] of Object.entries(categoryMapping)) {
      if (categoryName === "Ofertas" || categoryName === "Novidades") continue;

      const matchesKeyword = keywords.some((keyword) =>
        productName.includes(keyword)
      );
      if (matchesKeyword) {
        const category = allCategories.find((c) => c.name === categoryName);
        if (category) assignedCategories.push(category.id);
      }
    }

    // Se não achou categoria específica, atribuir uma categoria padrão
    if (assignedCategories.length === 0) {
      // Produtos genéricos vão para "Ofertas"
      const ofertasCategory = allCategories.find((c) => c.name === "Ofertas");
      if (ofertasCategory) assignedCategories.push(ofertasCategory.id);
    }

    // Chance de 30% de estar em "Ofertas" (adicional)
    if (Math.random() < 0.3) {
      const ofertasCategory = allCategories.find((c) => c.name === "Ofertas");
      if (ofertasCategory && !assignedCategories.includes(ofertasCategory.id)) {
        assignedCategories.push(ofertasCategory.id);
      }
    }

    // Chance de 20% de estar em "Novidades"
    if (Math.random() < 0.2) {
      const novidadesCategory = allCategories.find(
        (c) => c.name === "Novidades"
      );
      if (
        novidadesCategory &&
        !assignedCategories.includes(novidadesCategory.id)
      ) {
        assignedCategories.push(novidadesCategory.id);
      }
    }

    await prisma.product.update({
      where: { id: product.id },
      data: {
        categoryIds: assignedCategories,
      },
    });
  }

  console.log(
    `Seed completo: ${categories.length} categorias criadas e atribuídas a ${products.length} produtos.`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
