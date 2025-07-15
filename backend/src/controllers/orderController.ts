import { Request, Response } from "express";
import { Order, CreateOrderData, UpdateOrderData } from "../models/Order";
import { AuthService } from "../services/AuthService";
import { ApiResponse, AuthenticatedRequest } from "../types";

/**
 * Criar pedido (checkout)
 */
export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Usuário não autenticado" },
      } as ApiResponse);
      return;
    }

    const { items, deliveryAddress } = req.body;

    // Validação básica
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        error: { message: "Itens do pedido são obrigatórios" },
      } as ApiResponse);
      return;
    }

    if (!deliveryAddress) {
      res.status(400).json({
        success: false,
        error: { message: "Endereço de entrega é obrigatório" },
      } as ApiResponse);
      return;
    }

    const orderData: CreateOrderData = {
      customerId: req.user.id,
      items,
      deliveryAddress,
    };

    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      data: {
        message: "Pedido criado com sucesso",
        order,
      },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: { message: error.message },
      } as ApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};

/**
 * Listar pedidos
 */
export const getOrders = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Usuário não autenticado" },
      } as ApiResponse);
      return;
    }

    const { page = 1, limit = 20, status } = req.query;

    // Verificar se é admin
    const isAdmin = await AuthService.isAdmin(req.user.id);

    const filters: any = {
      page: Number(page),
      limit: Number(limit),
      status: status as any,
    };

    // Se não for admin, mostrar apenas pedidos do usuário
    if (!isAdmin) {
      filters.customerId = req.user.id;
    }

    const result = await Order.findMany(filters);

    res.status(200).json({
      success: true,
      data: result,
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};

/**
 * Obter pedido por ID
 */
export const getOrderById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Usuário não autenticado" },
      } as ApiResponse);
      return;
    }

    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        error: { message: "Pedido não encontrado" },
      } as ApiResponse);
      return;
    }

    // Verificar se é admin ou dono do pedido
    const isAdmin = await AuthService.isAdmin(req.user.id);
    const isOwner = await Order.isOwner(id, req.user.id);

    if (!isAdmin && !isOwner) {
      res.status(403).json({
        success: false,
        error: { message: "Acesso negado" },
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: { order },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};

/**
 * Atualizar pedido (admin ou status de pagamento)
 */
export const updateOrder = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Usuário não autenticado" },
      } as ApiResponse);
      return;
    }

    const { id } = req.params;
    const { status, deliveryAddress } = req.body;

    // Verificar se é admin (apenas admin pode atualizar pedidos)
    const isAdmin = await AuthService.isAdmin(req.user.id);
    if (!isAdmin) {
      res.status(403).json({
        success: false,
        error: {
          message:
            "Acesso negado. Apenas administradores podem atualizar pedidos",
        },
      } as ApiResponse);
      return;
    }

    const updateData: UpdateOrderData = {};
    if (status) updateData.status = status;
    if (deliveryAddress) updateData.deliveryAddress = deliveryAddress;

    const order = await Order.update(id, updateData);

    res.status(200).json({
      success: true,
      data: {
        message: "Pedido atualizado com sucesso",
        order,
      },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);

    if (error instanceof Error) {
      const statusCode = error.message.includes("não encontrado") ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: { message: error.message },
      } as ApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};

/**
 * Deletar pedido (admin)
 */
export const deleteOrder = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Usuário não autenticado" },
      } as ApiResponse);
      return;
    }

    const { id } = req.params;

    // Verificar se é admin
    const isAdmin = await AuthService.isAdmin(req.user.id);
    if (!isAdmin) {
      res.status(403).json({
        success: false,
        error: {
          message:
            "Acesso negado. Apenas administradores podem deletar pedidos",
        },
      } as ApiResponse);
      return;
    }

    await Order.delete(id);

    res.status(200).json({
      success: true,
      data: { message: "Pedido deletado com sucesso" },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);

    if (error instanceof Error) {
      const statusCode = error.message.includes("não encontrado") ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: { message: error.message },
      } as ApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};

/**
 * Obter estatísticas de vendas (admin)
 */
export const getSalesStats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Usuário não autenticado" },
      } as ApiResponse);
      return;
    }

    // Verificar se é admin
    const isAdmin = await AuthService.isAdmin(req.user.id);
    if (!isAdmin) {
      res.status(403).json({
        success: false,
        error: { message: "Acesso negado" },
      } as ApiResponse);
      return;
    }

    const { startDate, endDate } = req.query;

    const filters: any = {};
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);

    const stats = await Order.getSalesStats(filters);

    res.status(200).json({
      success: true,
      data: { stats },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};
