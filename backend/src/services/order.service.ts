import { PrismaClient, OrderStatus } from "../../generated/prisma";

const prisma = new PrismaClient();

interface CreateOrderData {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  deliveryAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface UpdateOrderData {
  status?: OrderStatus;
  deliveryAddress?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface OrderFilters {
  customerId?: string;
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

// Listar pedidos
export const getOrders = async (filters: OrderFilters = {}) => {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.customerId) {
    where.customerId = filters.customerId;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.createdAt.lte = filters.endDate;
    }
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                status: true,
              },
            },
          },
        },
        payment: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Buscar pedido por ID
export const getOrderById = async (
  id: string,
  userId: string,
  isAdmin: boolean = false
) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              status: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  // Verificar se usuário é o dono ou admin
  const isOwner = order.customerId === userId;
  if (!isAdmin && !isOwner) {
    throw new Error("Você não tem permissão para visualizar este pedido");
  }

  return order;
};

// Criar pedido
export const createOrder = async (data: CreateOrderData, userId: string) => {
  // Verificar se o cliente é o mesmo que o usuário autenticado
  if (data.customerId !== userId) {
    throw new Error("Você só pode criar pedidos para si mesmo");
  }

  // Validações básicas
  if (!data.customerId) {
    throw new Error("ID do cliente é obrigatório");
  }

  if (!data.items || data.items.length === 0) {
    throw new Error("Pedido deve ter pelo menos um item");
  }

  if (!data.deliveryAddress) {
    throw new Error("Endereço de entrega é obrigatório");
  }

  // Calcular preço total
  const totalPrice = data.items.reduce((total, item) => {
    if (item.quantity <= 0) {
      throw new Error("Quantidade deve ser maior que zero");
    }
    if (item.priceAtPurchase <= 0) {
      throw new Error("Preço deve ser maior que zero");
    }
    return total + item.priceAtPurchase * item.quantity;
  }, 0);

  // Verificar se todos os produtos existem e estão disponíveis
  for (const item of data.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error(`Produto ${item.productId} não encontrado`);
    }

    if (product.status !== "Available") {
      throw new Error(`Produto ${product.name} não está disponível`);
    }

    // Verificar se há estoque suficiente
    if (product.stock < item.quantity) {
      throw new Error(
        `Estoque insuficiente para o produto ${product.name}. Disponível: ${product.stock}, Solicitado: ${item.quantity}`
      );
    }

    // Verificar se o preço não mudou
    if (product.price !== item.priceAtPurchase) {
      throw new Error(
        `O preço do produto ${product.name} foi alterado. Por favor, atualize seu carrinho.`
      );
    }
  }

  // Criar pedido usando transação
  const order = await prisma.$transaction(async (tx) => {
    // Criar o pedido
    const newOrder = await tx.order.create({
      data: {
        customerId: data.customerId,
        totalPrice,
        deliveryAddress: data.deliveryAddress,
        status: OrderStatus.Pending,
      },
    });

    // Criar os itens do pedido
    await tx.orderItem.createMany({
      data: data.items.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      })),
    });

    // Atualizar estoque dos produtos
    for (const item of data.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Produto ${item.productId} não encontrado`);
      }

      const newStock = product.stock - item.quantity;

      // Atualizar estoque e status se necessário
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: newStock,
          status: newStock === 0 ? "Sold" : "Available",
        },
      });
    }

    return newOrder;
  });

  // Retornar pedido completo
  return await getOrderById(order.id, userId, true);
};

// Atualizar status do pedido
export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
  userId: string,
  isAdmin: boolean = false
) => {
  // Verificar se pedido existe
  const order = await prisma.order.findUnique({
    where: { id },
    select: { id: true, customerId: true },
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  // Apenas admin pode atualizar status do pedido
  if (!isAdmin) {
    throw new Error(
      "Apenas administradores podem atualizar o status do pedido"
    );
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return await getOrderById(updatedOrder.id, userId, isAdmin);
};

// Cancelar pedido
export const cancelOrder = async (
  id: string,
  userId: string,
  isAdmin: boolean = false
) => {
  // Verificar se pedido existe
  const order = await prisma.order.findUnique({
    where: { id },
    select: { id: true, customerId: true, status: true },
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  // Verificar permissões (admin ou dono)
  const isOwner = order.customerId === userId;
  if (!isAdmin && !isOwner) {
    throw new Error("Você não tem permissão para cancelar este pedido");
  }

  // Verificar se pedido pode ser cancelado
  if (!["Pending", "Paid"].includes(order.status)) {
    throw new Error("Este pedido não pode mais ser cancelado");
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: OrderStatus.Cancelled },
  });

  return await getOrderById(updatedOrder.id, userId, isAdmin);
};

// Deletar pedido
export const deleteOrder = async (
  id: string,
  userId: string,
  isAdmin: boolean = false
): Promise<void> => {
  // Verificar se pedido existe
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      payment: true,
    },
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  // Apenas admin pode deletar pedidos
  if (!isAdmin) {
    throw new Error("Apenas administradores podem excluir pedidos");
  }

  // Usar transação para deletar pedido e restaurar produtos
  await prisma.$transaction(async (tx) => {
    // Restaurar status dos produtos para Available
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { status: "Available" },
        });
      }
    }

    // Deletar itens do pedido
    await tx.orderItem.deleteMany({
      where: { orderId: id },
    });

    // Deletar pagamento se existir
    if (order.payment) {
      await tx.payment.delete({
        where: { orderId: id },
      });
    }

    // Finalmente, deletar o pedido
    await tx.order.delete({
      where: { id },
    });
  });
};

// Buscar pedidos do usuário
export const getUserOrders = async (
  userId: string,
  filters: Omit<OrderFilters, "customerId"> = {}
) => {
  return await getOrders({
    ...filters,
    customerId: userId,
  });
};

// Calcular estatísticas de vendas
export const getOrderSalesStats = async (filters?: {
  startDate?: Date;
  endDate?: Date;
}) => {
  const where: any = {};

  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.createdAt.lte = filters.endDate;
    }
  }

  const [totalOrders, totalRevenue, ordersByStatus] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.aggregate({
      where,
      _sum: { totalPrice: true },
    }),
    prisma.order.groupBy({
      by: ["status"],
      where,
      _count: { status: true },
    }),
  ]);

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.totalPrice || 0,
    ordersByStatus,
  };
};
