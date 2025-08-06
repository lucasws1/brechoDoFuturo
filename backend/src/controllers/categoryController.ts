import { Request, Response } from "express";
import * as categoryService from "../services/category.service";
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
  res.status(500).json({
    success: false,
    error: { message: (error as Error).message || message },
  });
};

interface CreateCategoryInput {
  name: string;
  description: string;
}

interface UpdateCategoryInput {
  name?: string;
  description?: string;
}

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, search } = req.query;

    const filters = {
      page: Number(page),
      limit: Number(limit),
      search: search as string | undefined,
    };

    const result = await categoryService.getCategories(filters);

    res.status(200).json({
      success: true,
      data: result.categories,
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar categorias");
  }
};

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    res.status(200).json({
      success: true,
      data: category,
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar categoria");
  }
};

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
      return;
    }

    const isAdmin = req.user.type === "Admin";
    if (!isAdmin) {
      res.status(403).json({
        success: false,
        error: { message: "Apenas administradores podem criar categorias" },
      } as ApiResponse);
      return;
    }

    const { name, description } = req.body;

    if (!name || !description) {
      res.status(400).json({
        success: false,
        error: { message: "Nome e descrição são obrigatórios" },
      } as ApiResponse);
      return;
    }

    const categoryData: CreateCategoryInput = {
      name,
      description,
    };

    const category = await categoryService.createCategory(categoryData);

    res.status(201).json({
      success: true,
      data: {
        message: "Categoria criada com sucesso",
        category,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao criar categoria");
  }
};

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
      return;
    }

    const { id } = req.params;
    const { name, description } = req.body;

    const updateData: UpdateCategoryInput = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    const isAdmin = req.user.type === "Admin";
    const category = await categoryService.updateCategory(
      id,
      updateData,
      isAdmin
    );

    res.status(200).json({
      success: true,
      data: {
        message: "Categoria atualizada com sucesso",
        category,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao atualizar categoria");
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
      return;
    }

    const { id } = req.params;
    const isAdmin = req.user.type === "Admin";
    await categoryService.deleteCategory(id, isAdmin);

    res.status(200).json({
      success: true,
      data: { message: "Categoria excluída com sucesso" },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao excluir categoria");
  }
};

/**
 * @desc    Get category statistics
 * @route   GET /api/categories/:id/stats
 * @access  Private/Admin
 */
export const getCategoryStats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
      return;
    }

    const isAdmin = req.user.type === "Admin";
    if (!isAdmin) {
      res.status(403).json({
        success: false,
        error: { message: "Apenas administradores podem ver estatísticas" },
      } as ApiResponse);
      return;
    }

    const { id } = req.params;
    const stats = await categoryService.getCategoryStats(id);

    res.status(200).json({
      success: true,
      data: stats,
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar estatísticas da categoria");
  }
};

/**
 * @desc    Get category hierarchy (breadcrumb)
 * @route   GET /api/categories/:id/hierarchy
 * @access  Public
 */
export const getCategoryHierarchy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hierarchy = await categoryService.getCategoryHierarchy(id);

    res.status(200).json({
      success: true,
      data: hierarchy,
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar hierarquia da categoria");
  }
};
