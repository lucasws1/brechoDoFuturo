import { PrismaClient, ProductStatus } from "../../generated/prisma";
import { mockProducts } from "../utils/mockProducts";

const prisma = new PrismaClient();

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  sellerId: string;
  categoryId?: string;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: string[];
  status?: ProductStatus;
  categoryId?: string;
}

interface ProductFilters {
  search?: string;
  categoryId?: string;
  category?: string; // Nome da categoria
  status?: ProductStatus;
  sellerId?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

// Listar produtos
export const getProducts = async (filters: ProductFilters = {}) => {
  // Apenas mostrar produtos disponíveis para usuários não autenticados
  if (!filters.sellerId) {
    filters.status = ProductStatus.Available;
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 12;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters?.categoryId && filters.categoryId.length > 0) {
    where.categoryId = filters.categoryId;
  }

  // Filtrar por nome ou ID da categoria
  if (filters?.category) {
    const categorySlug = filters.category;

    const category = await prisma.category.findFirst({
      where: { slug: { equals: categorySlug, mode: "insensitive" } },
      include: {
        subcategories: true,
      },
    });

    if (category) {
      // Se a categoria tem subcategorias, incluir produtos de todas elas
      if (category.subcategories && category.subcategories.length > 0) {
        const subcategoryIds = category.subcategories.map((sub) => sub.id);
        where.categoryId = {
          in: [category.id, ...subcategoryIds],
        };
      } else {
        // Se não tem subcategorias, buscar apenas produtos da categoria pai
        where.categoryId = category.id;
      }
    } else {
      // Se categoria não encontrada, retornar vazio usando um filtro que não encontra nada
      where.categoryId = "000000000000000000000000"; // ObjectID inválido mas válido em formato
    }
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.sellerId) {
    where.sellerId = filters.sellerId;
  }

  // Determinar ordenação baseada no filtro sort
  let orderBy: any = { createdAt: "desc" }; // Padrão: mais recentes primeiro

  if (filters?.sort) {
    if (filters.sort === "newest") {
      orderBy = { createdAt: "desc" };
    } else if (filters.sort === "oldest") {
      orderBy = { createdAt: "asc" };
    } else if (filters.sort === "price-asc") {
      orderBy = { price: "asc" };
    } else if (filters.sort === "price-desc") {
      orderBy = { price: "desc" };
    }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Buscar produto por ID
export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    throw new Error("Produto não encontrado");
  }

  return product;
};

// Criar produto
export const createProduct = async (
  data: CreateProductData,
  userId: string
) => {
  // Verificar se usuário é o vendedor
  if (data.sellerId !== userId) {
    throw new Error("Você só pode criar produtos para si mesmo");
  }

  // Validações básicas
  if (!data.name || data.name.trim().length === 0) {
    throw new Error("Nome do produto é obrigatório");
  }

  if (!data.price || data.price <= 0) {
    throw new Error("Preço deve ser maior que zero");
  }

  if (data.stock === undefined || data.stock < 0) {
    throw new Error("Estoque deve ser maior ou igual a zero");
  }

  if (!data.sellerId) {
    throw new Error("ID do vendedor é obrigatório");
  }

  return await prisma.product.create({
    data: {
      ...data,
      status: ProductStatus.Available,
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
    },
  });
};

// Atualizar produto
export const updateProduct = async (
  id: string,
  data: UpdateProductData,
  userId: string,
  isAdmin: boolean = false
) => {
  // Verificar se produto existe
  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, sellerId: true },
  });

  if (!product) {
    throw new Error("Produto não encontrado");
  }

  // Verificar permissões (admin ou dono)
  const isOwner = product.sellerId === userId;
  if (!isAdmin && !isOwner) {
    throw new Error("Você não tem permissão para editar este produto");
  }

  // Validações
  if (data.price !== undefined && data.price <= 0) {
    throw new Error("Preço deve ser maior que zero");
  }

  return await prisma.product.update({
    where: { id },
    data,
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
    },
  });
};

// Deletar produto (soft delete)
export const deleteProduct = async (
  id: string,
  userId: string,
  isAdmin: boolean = false
): Promise<void> => {
  // Verificar se produto existe
  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, sellerId: true },
  });

  if (!product) {
    throw new Error("Produto não encontrado");
  }

  // Verificar permissões (admin ou dono)
  const isOwner = product.sellerId === userId;
  if (!isAdmin && !isOwner) {
    throw new Error("Você não tem permissão para excluir este produto");
  }

  // Soft delete alterando status
  await prisma.product.update({
    where: { id },
    data: { status: ProductStatus.Hidden },
  });
};

// Buscar produtos por vendedor
export const getProductsBySeller = async (
  sellerId: string,
  filters: Omit<ProductFilters, "sellerId"> = {}
) => {
  return await getProducts({
    ...filters,
    sellerId,
  });
};

// Atualizar status do produto
export const updateProductStatus = async (
  id: string,
  status: ProductStatus,
  userId: string,
  isAdmin: boolean = false
) => {
  // Verificar se produto existe
  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, sellerId: true },
  });

  if (!product) {
    throw new Error("Produto não encontrado");
  }

  // Verificar permissões (admin ou dono)
  const isOwner = product.sellerId === userId;
  if (!isAdmin && !isOwner) {
    throw new Error(
      "Você não tem permissão para atualizar o status deste produto"
    );
  }

  return await prisma.product.update({
    where: { id },
    data: { status },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
    },
  });
};

// Popular banco com produtos mock
export const populateMockProducts = async (sellerId: string) => {
  const createdProducts = [];

  for (const mockProduct of mockProducts) {
    try {
      const product = await prisma.product.create({
        data: {
          name: mockProduct.name,
          description: mockProduct.description,
          price: mockProduct.price,
          images: [mockProduct.image], // Converter string para array
          status: ProductStatus.Available,
          sellerId,
          categoryId: "", // Por enquanto sem categorias
        },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      createdProducts.push(product);
    } catch (error) {
      console.error(`Erro ao criar produto ${mockProduct.name}:`, error);
    }
  }

  return createdProducts;
};
