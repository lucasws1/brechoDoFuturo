import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Busca todos os produtos
  const products = await prisma.product.findMany();

  for (const product of products) {
    const newImages = (product.images as string[]).map(
      (img) =>
        img
          .replace(/([&?])blur=\d+&?/g, (match, p1) => (p1 === "?" ? "?" : ""))
          .replace(/[?&]$/, "") // remove trailing ? ou &
          .replace("?&", "?") // caso reste isso
          .replace("&&", "&") // caso reste isso
    );

    // Só atualiza se mudou alguma coisa
    if (JSON.stringify(newImages) !== JSON.stringify(product.images)) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: newImages },
      });
      console.log(`Produto ${product.id} atualizado`);
    }
  }
  console.log("Imagens corrigidas!");
}

main().finally(() => prisma.$disconnect());
