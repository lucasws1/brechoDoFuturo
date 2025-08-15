import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

interface CreateCategoryData {
  name: string;
  description: string;
  slug: string;
}

interface UpdateCategoryData {
  name?: string;
  description?: string;
}

interface CategoryFilters {
  search?: string;
  page?: number;
  limit?: number;
}

const RESERVED = new Set(["c", "explorar", "admin", "api", "novo", "ofertas"]);

export function toSlug(input: string): string {
  if (RESERVED.has(input)) {
    throw new Error("Nome de categoria reservado");
  }

  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " e ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

// Criar categoria
export const createCategory = async (data: CreateCategoryData) => {
  // Validações básicas
  if (!data.name || data.name.trim().length === 0) {
    throw new Error("Nome da categoria é obrigatório");
  }

  if (!data.description || data.description.trim().length === 0) {
    throw new Error("Descrição da categoria é obrigatória");
  }

  // Verificar se categoria já existe
  const existingCategory = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existingCategory) {
    throw new Error("Categoria já existe");
  }

  return await prisma.category.create({
    data: {
      ...data,
      slug: toSlug(data.name),
    },
  });
};

// Listar categorias
export const getCategories = async (filters: CategoryFilters = {}) => {
  const page = filters?.page || 1;
  const limit = filters?.limit || 50;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      include: {
        Product: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.category.count({ where }),
  ]);

  return {
    categories,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Buscar categoria por ID
export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      Product: {
        select: {
          id: true,
          name: true,
          price: true,
          status: true,
          images: true,
        },
      },
    },
  });

  if (!category) {
    throw new Error("Categoria não encontrada");
  }

  return category;
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      subcategories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  return category;
};

// Atualizar categoria
export const updateCategory = async (
  id: string,
  data: UpdateCategoryData,
  isAdmin: boolean = false
) => {
  // Apenas admins podem atualizar categorias
  if (!isAdmin) {
    throw new Error("Apenas administradores podem atualizar categorias");
  }

  // Verificar se categoria existe
  const category = await prisma.category.findUnique({
    where: { id },
    select: { id: true, name: true },
  });

  if (!category) {
    throw new Error("Categoria não encontrada");
  }

  // Verificar se o novo nome já está em uso por outra categoria
  if (data.name && data.name !== category.name) {
    const existingCategory = await prisma.category.findUnique({
      where: { name: toSlug(data.name) },
    });

    if (existingCategory) {
      throw new Error("Nome da categoria já está em uso");
    }
  }

  return await prisma.category.update({
    where: { id },
    data,
  });
};

// Deletar categoria
export const deleteCategory = async (id: string, isAdmin: boolean = false) => {
  // Apenas admins podem deletar categorias
  if (!isAdmin) {
    throw new Error("Apenas administradores podem deletar categorias");
  }

  // Verificar se categoria existe
  const category = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!category) {
    throw new Error("Categoria não encontrada");
  }

  // Verificar se há produtos associados
  const productsCount = await prisma.product.count({
    where: {
      categoryId: id,
    },
  });

  if (productsCount > 0) {
    throw new Error("Não é possível deletar categoria com produtos associados");
  }

  await prisma.category.delete({
    where: { id },
  });
};

// Obter estatísticas da categoria
export const getCategoryStats = async (id: string) => {
  const category = await getCategoryById(id);

  const stats = await prisma.product.groupBy({
    by: ["status"],
    where: {
      categoryId: id,
    },
    _count: { status: true },
  });

  return {
    category,
    productStats: stats,
  };
};

// Buscar hierarquia completa de uma categoria
export const getCategoryHierarchy = async (categorySlug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
        },
      },
    },
  });

  if (!category) {
    throw new Error("Categoria não encontrada");
  }

  const hierarchy: any[] = [];
  let currentCategory = category;

  // Adiciona a categoria atual
  hierarchy.unshift({
    id: currentCategory.id,
    name: currentCategory.name,
    description: currentCategory.description,
    slug: currentCategory.slug,
  });

  // Busca todos os pais recursivamente
  while (currentCategory.parent) {
    currentCategory = currentCategory.parent as any;
    hierarchy.unshift({
      id: currentCategory.id,
      name: currentCategory.name,
      description: currentCategory.description,
      slug: currentCategory.slug,
    });
  }

  return hierarchy;
};
