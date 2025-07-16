import { Response } from "express";
import {
  getUsers as getUsersService,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
  getUserOrders as getUserOrdersService,
  changeUserRole,
} from "../services/user.service";
import { UserType } from "../../generated/prisma";
import { AuthenticatedRequest } from "../middleware/auth";

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
  const status =
    error.message === "Acesso negado"
      ? 403
      : error.message.includes("não encontrado")
      ? 404
      : error.message.includes("já está em uso")
      ? 409
      : 500;
  res.status(status).json({
    success: false,
    error: { message: (error as Error).message || message },
  });
};

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
      });
      return;
    }

    const { page = "1", limit = "20", search, type } = req.query;

    const filters = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      search: search as string,
      type: type as UserType,
    };

    const result = await getUsersService(filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(res, error, "Erro ao listar usuários");
  }
};

/**
 * Obter usuário por ID
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
      });
      return;
    }

    const { id } = req.params;
    const isAdmin = req.user.type === UserType.Admin;

    const user = await getUserByIdService(id, req.user.id, isAdmin);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    handleError(res, error, "Erro ao buscar usuário");
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
      });
      return;
    }

    const { id } = req.params;
    const isAdmin = req.user.type === UserType.Admin;

    const updatedUser = await updateUserService(
      id,
      req.body,
      req.user.id,
      isAdmin
    );

    res.status(200).json({
      success: true,
      data: {
        message: "Usuário atualizado com sucesso",
        user: updatedUser,
      },
    });
  } catch (error) {
    handleError(res, error, "Erro ao atualizar usuário");
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
      });
      return;
    }

    const { id } = req.params;
    const isAdmin = req.user.type === UserType.Admin;

    await deleteUserService(id, req.user.id, isAdmin);

    res.status(200).json({
      success: true,
      data: { message: "Usuário excluído com sucesso" },
    });
  } catch (error) {
    handleError(res, error, "Erro ao excluir usuário");
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
      });
      return;
    }

    const { id } = req.params;
    const { page = "1", limit = "10", status } = req.query;
    const isAdmin = req.user.type === UserType.Admin;

    const orders = await getUserOrdersService(
      id,
      {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        status: status as string,
      },
      req.user.id,
      isAdmin
    );

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    handleError(res, error, "Erro ao buscar pedidos do usuário");
  }
};

/**
 * Atualizar função do usuário (apenas admin)
 */
export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Usuário não autenticado" },
      });
      return;
    }

    const { id } = req.params;
    const { role } = req.body;

    if (!role || !Object.values(UserType).includes(role as UserType)) {
      res.status(400).json({
        success: false,
        error: { message: "Função de usuário inválida" },
      });
      return;
    }

    const isAdmin = req.user.type === UserType.Admin;
    const updatedUser = await changeUserRole(
      id,
      role as UserType,
      req.user.id,
      isAdmin
    );

    res.status(200).json({
      success: true,
      data: {
        message: "Função do usuário atualizada com sucesso",
        user: updatedUser,
      },
    });
  } catch (error) {
    handleError(res, error, "Erro ao atualizar função do usuário");
  }
};
