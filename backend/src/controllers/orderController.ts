import { Request, Response } from 'express';
import * as orderService from '../services/order.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Tipos para responses
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: {
    message: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Função helper para tratar erros
const handleError = (res: Response, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({
    success: false,
    error: { message: (error as Error).message || message },
  });
};

interface CreateOrderInput {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    priceAtPurchase: number;
  }>;
  deliveryAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
}

/**
 * @desc    Create a new order (checkout)
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autorizado' },
      } as ApiResponse);
    }

    const { items, deliveryAddress, paymentMethod } = req.body;

    // Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Itens do pedido são obrigatórios' },
      } as ApiResponse);
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        error: { message: 'Endereço de entrega é obrigatório' },
      } as ApiResponse);
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        error: { message: 'Método de pagamento é obrigatório' },
      } as ApiResponse);
    }

    const orderData: CreateOrderInput = {
      customerId: req.user.id,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase || 0,
      })),
      deliveryAddress,
      paymentMethod,
    };

    const order = await orderService.createOrder(orderData, req.user.id);

    res.status(201).json({
      success: true,
      data: {
        message: 'Pedido criado com sucesso',
        order,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, 'Erro ao criar pedido');
  }
};

/**
 * @desc    Get all orders (admin) or user's orders
 * @route   GET /api/orders
 * @access  Private
 */
export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autorizado' },
      } as ApiResponse);
    }

    const { page = 1, limit = 20, status } = req.query;
    const isAdmin = req.user.type === 'Admin';

    const filters = {
      page: Number(page),
      limit: Number(limit),
      status: status as any,
      customerId: isAdmin ? undefined : req.user.id,
    };

    const result = await orderService.getOrders(filters);

    res.status(200).json({
      success: true,
      data: result.orders,
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, 'Erro ao listar pedidos');
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autorizado' },
      } as ApiResponse);
    }

    const { id } = req.params;
    const isAdmin = req.user.type === 'Admin';
    const order = await orderService.getOrderById(id, req.user.id, isAdmin);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { message: 'Pedido não encontrado' },
      } as ApiResponse);
    }

    res.status(200).json({
      success: true,
      data: order,
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, 'Erro ao buscar pedido');
  }
};

/**
 * @desc    Update order status (admin only)
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 */
export const updateOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autorizado' },
      } as ApiResponse);
    }

    const { id } = req.params;
    const { status } = req.body;
    const isAdmin = req.user.type === 'Admin';

    const order = await orderService.updateOrderStatus(
      id,
      status,
      req.user.id,
      isAdmin
    );

    res.status(200).json({
      success: true,
      data: {
        message: 'Pedido atualizado com sucesso',
        order,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, 'Erro ao atualizar pedido');
  }
};

/**
 * @desc    Delete an order (admin only)
 * @route   DELETE /api/orders/:id
 * @access  Private/Admin
 */
export const deleteOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autorizado' },
      } as ApiResponse);
    }

    const { id } = req.params;
    const isAdmin = req.user.type === 'Admin';
    await orderService.deleteOrder(id, req.user.id, isAdmin);

    res.status(200).json({
      success: true,
      data: { message: 'Pedido excluído com sucesso' },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, 'Erro ao excluir pedido');
  }
};

/**
 * @desc    Get sales statistics (admin only)
 * @route   GET /api/orders/stats/sales
 * @access  Private/Admin
 */
export const getSalesStats = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autorizado' },
      } as ApiResponse);
    }

    const { startDate, endDate } = req.query;
    const isAdmin = req.user.type === 'Admin';

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Acesso negado' },
      } as ApiResponse);
    }

    // Implementar getSalesStats no service
    const stats = {
      totalOrders: 0,
      totalRevenue: 0,
      ordersByStatus: [],
    };

    res.status(200).json({
      success: true,
      data: stats,
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, 'Erro ao buscar estatísticas de vendas');
  }
};
