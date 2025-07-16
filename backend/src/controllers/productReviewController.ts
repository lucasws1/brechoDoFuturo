import { Request, Response } from "express";
import * as productReviewService from "../services/productReview.service";
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

interface CreateProductReviewInput {
  productId: string;
  rating: number;
  comment: string;
}

interface UpdateProductReviewInput {
  rating?: number;
  comment?: string;
}

/**
 * @desc    Create a product review
 * @route   POST /api/products/:productId/reviews
 * @access  Private
 */
export const createProductReview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
    }

    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      res.status(400).json({
        success: false,
        error: { message: "Avaliação e comentário são obrigatórios" },
      } as ApiResponse);
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        error: { message: "Avaliação deve ser entre 1 e 5" },
      } as ApiResponse);
    }

    const reviewData: CreateProductReviewInput = {
      productId,
      rating: Number(rating),
      comment,
    };

    const review = await productReviewService.createProductReview(
      reviewData,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: {
        message: "Avaliação criada com sucesso",
        review,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao criar avaliação");
  }
};

/**
 * @desc    Get reviews for a product
 * @route   GET /api/products/:productId/reviews
 * @access  Public
 */
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 20, rating } = req.query;

    const filters = {
      page: Number(page),
      limit: Number(limit),
      rating: rating ? Number(rating) : undefined,
    };

    const result = await productReviewService.getProductReviews(
      productId,
      filters
    );

    res.status(200).json({
      success: true,
      data: result.reviews,
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar avaliações do produto");
  }
};

/**
 * @desc    Get review by ID
 * @route   GET /api/reviews/:id
 * @access  Public
 */
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await productReviewService.getProductReviewById(id);

    res.status(200).json({
      success: true,
      data: review,
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar avaliação");
  }
};

/**
 * @desc    Update a product review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
export const updateProductReview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
    }

    const { id } = req.params;
    const { rating, comment } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      res.status(400).json({
        success: false,
        error: { message: "Avaliação deve ser entre 1 e 5" },
      } as ApiResponse);
    }

    const updateData: UpdateProductReviewInput = {};
    if (rating) updateData.rating = Number(rating);
    if (comment) updateData.comment = comment;

    const review = await productReviewService.updateProductReview(
      id,
      updateData,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: {
        message: "Avaliação atualizada com sucesso",
        review,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao atualizar avaliação");
  }
};

/**
 * @desc    Delete a product review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteProductReview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
    }

    const { id } = req.params;
    const isAdmin = req.user.type === "Admin";

    await productReviewService.deleteProductReview(id, req.user.id, isAdmin);

    res.status(200).json({
      success: true,
      data: { message: "Avaliação excluída com sucesso" },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao excluir avaliação");
  }
};

/**
 * @desc    Get user's reviews
 * @route   GET /api/users/:userId/reviews
 * @access  Private
 */
export const getUserReviews = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
    }

    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Usuários só podem ver suas próprias avaliações, exceto admins
    const isAdmin = req.user.type === "Admin";
    if (!isAdmin && userId !== req.user.id) {
      res.status(403).json({
        success: false,
        error: { message: "Você só pode ver suas próprias avaliações" },
      } as ApiResponse);
    }

    const filters = {
      page: Number(page),
      limit: Number(limit),
    };

    const result = await productReviewService.getUserReviews(userId, filters);

    res.status(200).json({
      success: true,
      data: result.reviews,
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar avaliações do usuário");
  }
};

/**
 * @desc    Get product review statistics
 * @route   GET /api/products/:productId/reviews/stats
 * @access  Public
 */
export const getProductReviewStats = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const stats = await productReviewService.getProductReviewStats(productId);

    res.status(200).json({
      success: true,
      data: stats,
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar estatísticas de avaliações");
  }
};

/**
 * @desc    Get all reviews (admin only)
 * @route   GET /api/reviews
 * @access  Private/Admin
 */
export const getAllReviews = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
    }

    const { page = 1, limit = 20, productId, userId, rating } = req.query;

    const filters = {
      page: Number(page),
      limit: Number(limit),
      productId: productId as string | undefined,
      userId: userId as string | undefined,
      rating: rating ? Number(rating) : undefined,
    };

    const isAdmin = req.user.type === "Admin";
    const result = await productReviewService.getAllReviews(filters, isAdmin);

    res.status(200).json({
      success: true,
      data: result.reviews,
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar todas as avaliações");
  }
};
