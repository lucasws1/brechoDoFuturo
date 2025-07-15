import {
  PrismaClient,
  Order as PrismaOrder,
  OrderStatus,
  OrderItem,
} from "../../generated/prisma";

const prisma = new PrismaClient();

export interface CreateOrderData {
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

export interface UpdateOrderData {
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

export class Order {
  // Criar pedido (checkout)
  static async create(data: CreateOrderData): Promise<PrismaOrder> {
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

      // Atualizar status dos produtos para Sold (se quantidade = 1)
      // Para um brechó, assumindo que cada produto é único
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { status: "Sold" },
        });
      }

      return newOrder;
    });

    // Retornar pedido com itens
    return (await this.findById(order.id)) as PrismaOrder;
  }

  // Buscar pedido por ID
  static async findById(id: string): Promise<PrismaOrder | null> {
    return await prisma.order.findUnique({
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
            product: true,
          },
        },
        payment: true,
      },
    });
  }

  // Listar pedidos com filtros
  static async findMany(filters?: {
    customerId?: string;
    status?: OrderStatus;
    page?: number;
    limit?: number;
  }) {
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
              product: true,
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
  }

  // Atualizar pedido
  static async update(id: string, data: UpdateOrderData): Promise<PrismaOrder> {
    // Verificar se pedido existe
    const order = await this.findById(id);
    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data,
    });

    return (await this.findById(updatedOrder.id)) as PrismaOrder;
  }

  // Deletar pedido (admin)
  static async delete(id: string): Promise<void> {
    // Verificar se pedido existe
    const order = await this.findById(id);
    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    // Usar transação para deletar pedido e restaurar produtos
    await prisma.$transaction(async (tx) => {
      // Restaurar status dos produtos para Available
      if (order.items) {
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

      // Deletar pedido
      await tx.order.delete({
        where: { id },
      });
    });
  }

  // Verificar se usuário é dono do pedido
  static async isOwner(orderId: string, userId: string): Promise<boolean> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { customerId: true },
    });

    return order?.customerId === userId;
  }

  // Calcular estatísticas de vendas (admin)
  static async getSalesStats(filters?: { startDate?: Date; endDate?: Date }) {
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
  }
}
