import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

interface CreateProductReviewData {
  productId: string;
  rating: number;
  comment: string;
}

interface UpdateProductReviewData {
  rating?: number;
  comment?: string;
}

interface ProductReviewFilters {
  productId?: string;
  userId?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

// Criar avaliação de produto
export const createProductReview = async (
  data: CreateProductReviewData,
  userId: string
) => {
  // Validações básicas
  if (!data.productId) {
    throw new Error('ID do produto é obrigatório');
  }

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    throw new Error('Avaliação deve ser entre 1 e 5');
  }

  if (!data.comment || data.comment.trim().length === 0) {
    throw new Error('Comentário é obrigatório');
  }

  // Verificar se produto existe
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) {
    throw new Error('Produto não encontrado');
  }

  // Verificar se usuário não está avaliando seu próprio produto
  if (product.sellerId === userId) {
    throw new Error('Você não pode avaliar seu próprio produto');
  }

  // Verificar se usuário já avaliou este produto
  const existingReview = await prisma.productReview.findUnique({
    where: {
      productId_userId: {
        productId: data.productId,
        userId,
      },
    },
  });

  if (existingReview) {
    throw new Error('Você já avaliou este produto');
  }

  // Verificar se usuário comprou o produto (opcional - pode ser implementado depois)
  // TODO: Implementar verificação de compra

  return await prisma.productReview.create({
    data: {
      ...data,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

// Buscar avaliações de um produto
export const getProductReviews = async (
  productId: string,
  filters: Omit<ProductReviewFilters, 'productId'> = {}
) => {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = { productId };

  if (filters?.rating) {
    where.rating = filters.rating;
  }

  const [reviews, total] = await Promise.all([
    prisma.productReview.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.productReview.count({ where }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Buscar avaliações de um usuário
export const getUserReviews = async (
  userId: string,
  filters: Omit<ProductReviewFilters, 'userId'> = {}
) => {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const where = { userId };

  const [reviews, total] = await Promise.all([
    prisma.productReview.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.productReview.count({ where }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Buscar avaliação por ID
export const getProductReviewById = async (id: string) => {
  const review = await prisma.productReview.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!review) {
    throw new Error('Avaliação não encontrada');
  }

  return review;
};

// Atualizar avaliação
export const updateProductReview = async (
  id: string,
  data: UpdateProductReviewData,
  userId: string
) => {
  const review = await prisma.productReview.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!review) {
    throw new Error('Avaliação não encontrada');
  }

  // Verificar se usuário é dono da avaliação
  if (review.userId !== userId) {
    throw new Error('Você só pode editar suas próprias avaliações');
  }

  // Validações
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new Error('Avaliação deve ser entre 1 e 5');
  }

  return await prisma.productReview.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

// Deletar avaliação
export const deleteProductReview = async (
  id: string,
  userId: string,
  isAdmin: boolean = false
) => {
  const review = await prisma.productReview.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!review) {
    throw new Error('Avaliação não encontrada');
  }

  // Verificar permissões (dono da avaliação ou admin)
  if (!isAdmin && review.userId !== userId) {
    throw new Error('Você só pode deletar suas próprias avaliações');
  }

  await prisma.productReview.delete({
    where: { id },
  });
};

// Calcular estatísticas de avaliações de um produto
export const getProductReviewStats = async (productId: string) => {
  const stats = await prisma.productReview.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const ratingDistribution = await prisma.productReview.groupBy({
    by: ['rating'],
    where: { productId },
    _count: { rating: true },
    orderBy: { rating: 'desc' },
  });

  return {
    averageRating: Math.round((stats._avg.rating || 0) * 10) / 10, // Arredondar para 1 decimal
    totalReviews: stats._count.rating || 0,
    ratingDistribution: ratingDistribution.map((item) => ({
      rating: item.rating,
      count: item._count.rating,
    })),
  };
};

// Listar todas as avaliações (admin)
export const getAllReviews = async (
  filters: ProductReviewFilters = {},
  isAdmin: boolean = false
) => {
  if (!isAdmin) {
    throw new Error('Apenas administradores podem listar todas as avaliações');
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.productId) {
    where.productId = filters.productId;
  }

  if (filters?.userId) {
    where.userId = filters.userId;
  }

  if (filters?.rating) {
    where.rating = filters.rating;
  }

  const [reviews, total] = await Promise.all([
    prisma.productReview.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.productReview.count({ where }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
