import {
  PrismaClient,
  Product as PrismaProduct,
  ProductStatus,
} from "../../generated/prisma";

const prisma = new PrismaClient();

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  images: string[];
  sellerId: string;
  categoryIds: string[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  status?: ProductStatus;
  categoryIds?: string[];
}

export class Product {
  // Criar produto
  static async create(data: CreateProductData): Promise<PrismaProduct> {
    // Validações básicas
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Nome do produto é obrigatório");
    }

    if (!data.price || data.price <= 0) {
      throw new Error("Preço deve ser maior que zero");
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
        seller: true,
        categories: true,
      },
    });
  }

  // Listar produtos com filtros
  static async findMany(filters?: {
    search?: string;
    categoryIds?: string[];
    status?: ProductStatus;
    sellerId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
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
          seller: true,
          categories: true,
          reviews: {
            include: {
              user: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
  }

  // Buscar produto por ID
  static async findById(id: string): Promise<PrismaProduct | null> {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        seller: true,
        categories: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  // Atualizar produto
  static async update(
    id: string,
    data: UpdateProductData
  ): Promise<PrismaProduct> {
    // Verificar se produto existe
    const product = await this.findById(id);
    if (!product) {
      throw new Error("Produto não encontrado");
    }

    // Validações
    if (data.price !== undefined && data.price <= 0) {
      throw new Error("Preço deve ser maior que zero");
    }

    return await prisma.product.update({
      where: { id },
      data,
      include: {
        seller: true,
        categories: true,
      },
    });
  }

  // Deletar produto
  static async delete(id: string): Promise<void> {
    // Verificar se produto existe
    const product = await this.findById(id);
    if (!product) {
      throw new Error("Produto não encontrado");
    }

    await prisma.product.delete({
      where: { id },
    });
  }

  // Verificar se usuário é o vendedor do produto
  static async isOwner(productId: string, userId: string): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { sellerId: true },
    });

    return product?.sellerId === userId;
  }
}
