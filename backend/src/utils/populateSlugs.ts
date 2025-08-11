import prisma from "../config/prisma";

const toSlug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function main() {
  // pegue todos, mas só atualize quem está sem slug
  const cats = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
  });

  // mapa com slugs já existentes no banco (inclui os já preenchidos)
  const existing = new Set(
    cats.map((c: any) => c.slug).filter(Boolean) as string[]
  );

  for (const c of cats) {
    if (c.slug) continue;

    let base = toSlug(c.name);
    if (!base) base = "categoria";

    let candidate = base;
    let i = 2;
    while (existing.has(candidate)) {
      candidate = `${base}-${i++}`;
    }
    existing.add(candidate);

    await prisma.category.update({
      where: { id: c.id },
      data: { slug: candidate },
    });
  }

  console.log("Slugs populados com sucesso.");
}

main().finally(() => prisma.$disconnect());
