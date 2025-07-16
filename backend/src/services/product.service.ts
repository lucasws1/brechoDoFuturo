import { PrismaClient, ProductStatus } from '../../generated/prisma';

const prisma = new PrismaClient();

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  images: string[];
  sellerId: string;
  categoryIds: string[];
}

interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  status?: ProductStatus;
  categoryIds?: string[];
}

interface ProductFilters {
  search?: string;
  categoryIds?: string[];
  status?: ProductStatus;
  sellerId?: string;
  page?: number;
  limit?: number;
}

// Listar produtos
export const getProducts = async (filters: ProductFilters = {}) => {
  // Apenas mostrar produtos disponíveis para usuários não autenticados
  if (!filters.sellerId) {
    filters.status = ProductStatus.Available;
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters?.categoryIds && filters.categoryIds.length > 0) {
    where.categoryIds = { hasSome: filters.categoryIds };
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.sellerId) {
    where.sellerId = filters.sellerId;
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
        categories: true,
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
      orderBy: { createdAt: 'desc' },
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
      categories: true,
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
    throw new Error('Produto não encontrado');
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
    throw new Error('Você só pode criar produtos para si mesmo');
  }

  // Validações básicas
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('Nome do produto é obrigatório');
  }

  if (!data.price || data.price <= 0) {
    throw new Error('Preço deve ser maior que zero');
  }

  if (!data.sellerId) {
    throw new Error('ID do vendedor é obrigatório');
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
      categories: true,
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
    throw new Error('Produto não encontrado');
  }

  // Verificar permissões (admin ou dono)
  const isOwner = product.sellerId === userId;
  if (!isAdmin && !isOwner) {
    throw new Error('Você não tem permissão para editar este produto');
  }

  // Validações
  if (data.price !== undefined && data.price <= 0) {
    throw new Error('Preço deve ser maior que zero');
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
      categories: true,
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
    throw new Error('Produto não encontrado');
  }

  // Verificar permissões (admin ou dono)
  const isOwner = product.sellerId === userId;
  if (!isAdmin && !isOwner) {
    throw new Error('Você não tem permissão para excluir este produto');
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
  filters: Omit<ProductFilters, 'sellerId'> = {}
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
    throw new Error('Produto não encontrado');
  }

  // Verificar permissões (admin ou dono)
  const isOwner = product.sellerId === userId;
  if (!isAdmin && !isOwner) {
    throw new Error(
      'Você não tem permissão para atualizar o status deste produto'
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
      categories: true,
    },
  });
};
