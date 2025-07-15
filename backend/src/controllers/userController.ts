import { Request, Response } from "express";
import { User, UpdateUserData } from "../models/User";
import { AuthService } from "../services/AuthService";
import { ApiResponse, AuthenticatedRequest } from "../types";

/**
 * Listar usuários (admin)
 */
export const getUsers = async (
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

    const { page = 1, limit = 20, search, type } = req.query;

    const filters = {
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      type: type as any,
    };

    const result = await User.findMany(filters);

    res.status(200).json({
      success: true,
      data: result,
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};

/**
 * Obter usuário por ID (admin)
 */
export const getUserById = async (
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

    // Verificar se é admin ou é o próprio usuário
    const isAdmin = await AuthService.isAdmin(req.user.id);
    if (!isAdmin && req.user.id !== id) {
      res.status(403).json({
        success: false,
        error: { message: "Acesso negado" },
      } as ApiResponse);
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: { message: "Usuário não encontrado" },
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: { user },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};

/**
 * Atualizar dados do usuário
 */
export const updateUser = async (
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
    const { name, email, phone, address } = req.body;

    // Verificar se é admin ou é o próprio usuário
    const isAdmin = await AuthService.isAdmin(req.user.id);
    if (!isAdmin && req.user.id !== id) {
      res.status(403).json({
        success: false,
        error: { message: "Acesso negado" },
      } as ApiResponse);
      return;
    }

    const updateData: UpdateUserData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const user = await User.update(id, updateData);

    res.status(200).json({
      success: true,
      data: {
        message: "Usuário atualizado com sucesso",
        user,
      },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);

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
 * Deletar usuário (admin)
 */
export const deleteUser = async (
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
        error: { message: "Acesso negado" },
      } as ApiResponse);
      return;
    }

    // Não permitir que admin delete a si mesmo
    if (req.user.id === id) {
      res.status(400).json({
        success: false,
        error: { message: "Você não pode deletar sua própria conta" },
      } as ApiResponse);
      return;
    }

    await User.delete(id);

    res.status(200).json({
      success: true,
      data: { message: "Usuário deletado com sucesso" },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);

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
 * Obter pedidos do usuário
 */
export const getUserOrders = async (
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

    const { page = 1, limit = 10 } = req.query;

    // Usuários só podem ver seus próprios pedidos
    const result = await User.getUserOrders(
      req.user.id,
      Number(page),
      Number(limit)
    );

    res.status(200).json({
      success: true,
      data: result,
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao buscar pedidos do usuário:", error);
    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};
