// scripts/seedProducts.ts
import { faker } from "@faker-js/faker";
import { PrismaClient, ProductStatus } from "../../generated/prisma";

const prisma = new PrismaClient();
// Ajuste o caminho do import do PrismaClient conforme sua estrutura de build/tsconfig

async function main() {
  // Coloque aqui um ID válido de um usuário vendedor cadastrado previamente
  const sellerId = "687d6fb9c3be4fda2c6aba9a"; // Substitua pelo seu sellerId válido do banco

  // Coloque aqui IDs válidos de categorias já criadas
  const categoryIds = [
    "687d7a795756c558dba930bf",
    "687d7a795756c558dba930c0",
    "687d7a795756c558dba930c1",
    "687d7a795756c558dba930c2",
    "687d7a795756c558dba930c3",
    // ...adicione mais se desejar
  ];

  const products = [];

  for (let i = 0; i < 40; i++) {
    products.push({
      sellerId,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 20, max: 500 })),
      images: [
        faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
        faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
      ],
      stock: faker.number.int({ min: 1, max: 10 }),
      status: ProductStatus.Available,
      categoryIds: [
        categoryIds[Math.floor(Math.random() * categoryIds.length)],
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await prisma.product.createMany({ data: products });
  console.log("40 produtos inseridos com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
