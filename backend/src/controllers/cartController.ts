import { Request, Response } from "express";
import * as cartService from "../services/cart.service";
import { AuthenticatedRequest } from "../middleware/auth";
import prisma from "../config/prisma";

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

interface AddCartItemInput {
  productId: string;
  quantity: number;
}

interface UpdateCartItemInput {
  quantity: number;
}

export interface CartValidationResult {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface StockValidationError {
  available: number;
  requested: number;
  productId: string;
  productName: string;
}

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    let userId = req.user?.id;
    let sessionId = req.sessionId;

    if (!userId && !sessionId) {
      res.status(401).json({
        success: false,
        error: { message: "Não há usuário nem sessionId para buscar carrinho" },
      } as ApiResponse);
      return;
    }

    const cart = await cartService.getCartByUserId(userId, sessionId);

    if (!cart) {
      res.status(404).json({
        success: false,
        error: { message: "Carrinho não encontrado" },
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: cart,
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar carrinho");
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Private
 */
export const addItemToCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { productId, quantity } = req.body;
  const userId = req.user?.id;
  let cartSid = req.cookies.cart_sid;

  // Criar sessão anônima se necessário
  if (!userId && !cartSid) {
    cartSid = crypto.randomUUID();
    res.cookie("cart_sid", cartSid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 dias
    });
  }

  // Buscar carrinho existente (guest ou logado)
  let cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionId: cartSid },
    include: { items: { include: { product: true } } },
  });

  // Criar carrinho se não existir
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: userId || undefined,
        sessionId: cartSid || undefined,
        items: {
          create: [],
        },
      },
      include: { items: { include: { product: true } } },
    });
  }
  // versão original do additemtocard
  const result = await cartService.addItemToCart(
    cart.userId || undefined,
    cart.sessionId || undefined,
    {
      productId,
      quantity,
    }
  );

  if (!result.success) {
    // Mapear códigos de erro para status HTTP apropriados
    let statusCode = 400; // default

    switch (result.error?.code) {
      case "MISSING_FIELDS":
      case "INVALID_QUANTITY":
        statusCode = 400;
        break;
      case "PRODUCT_NOT_FOUND":
        statusCode = 404;
        break;
      case "INSUFFICIENT_STOCK":
      case "PRODUCT_UNAVAILABLE":
        statusCode = 422; // Unprocessable Entity
        break;
      case "OWN_PRODUCT":
        statusCode = 403;
        break;
      case "DATABASE_ERROR":
        statusCode = 500;
        break;
      default:
        statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      error: result.error,
    } as ApiResponse);
    return;
  }

  res.status(201).json({
    success: true,
    data: {
      message: "Item adicionado ao carrinho com sucesso",
      item: result.data,
    },
  } as ApiResponse);
};

/**
 * @desc    Update cart item
 * @route   PUT /api/cart/items/:itemId
 * @access  Private
 */
export const updateCartItem = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    let userId = req.user?.id;
    let sessionId = req.sessionId;

    if (!userId && !sessionId) {
      res.status(401).json({
        success: false,
        error: {
          message:
            "Não há usuário nem sessionId para atualizar item do carrinho",
        },
      } as ApiResponse);
      return;
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    const result = await cartService.updateCartItem(
      itemId,
      { quantity },
      userId || undefined,
      sessionId || undefined
    );

    if (!result.success) {
      let statusCode = 400;

      switch (result.error?.code) {
        case "MISSING_FIELDS":
        case "INVALID_QUANTITY":
          statusCode = 400;
          break;
        case "ITEM_NOT_FOUND":
        case "PRODUCT_NOT_FOUND":
          statusCode = 404;
          break;
        case "PRODUCT_UNAVAILABLE":
          statusCode = 422;
          break;
        case "UNAUTHORIZED":
          statusCode = 403;
          break;
        case "DATABASE_ERROR":
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        error: result.error,
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        message: "Item atualizado com sucesso",
        item: result.data,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao atualizar item do carrinho");
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:itemId
 * @access  Private
 */
export const removeCartItem = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    let userId = req.user?.id;
    let sessionId = req.sessionId;

    if (!userId && !sessionId) {
      res.status(401).json({
        success: false,
        error: {
          message: "Não há usuário nem sessionId para remover item do carrinho",
        },
      } as ApiResponse);
      return;
    }

    const { itemId } = req.params;
    const result = await cartService.removeCartItem(
      itemId,
      userId || undefined,
      sessionId || undefined
    );

    if (!result.success) {
      let statusCode = 400;

      switch (result.error?.code) {
        case "ITEM_NOT_FOUND":
          statusCode = 404;
          break;
        case "UNAUTHORIZED":
          statusCode = 403;
          break;
        case "DATABASE_ERROR":
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        error: result.error,
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: { message: "Item removido do carrinho com sucesso" },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao remover item do carrinho");
  }
};

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
export const clearCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    let userId = req.user?.id;
    let sessionId = req.sessionId;

    if (!userId && !sessionId) {
      res.status(401).json({
        success: false,
        error: { message: "Não há usuário nem sessionId para limpar carrinho" },
      } as ApiResponse);
      return;
    }

    const result = await cartService.clearCart(
      userId || undefined,
      sessionId || undefined
    );

    if (!result.success) {
      let statusCode = 400;

      switch (result.error?.code) {
        case "DATABASE_ERROR":
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        error: result.error,
      } as ApiResponse);
      return;
    }

    if (!result.data) {
      res.status(404).json({
        success: false,
        error: { message: "Carrinho não encontrado" },
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: { message: "Carrinho limpo com sucesso" },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao limpar carrinho");
  }
};

/**
 * @desc    Get cart total
 * @route   GET /api/cart/total
 * @access  Private
 */
export const getCartTotal = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    let userId = req.user?.id;
    let sessionId = req.sessionId;

    if (!userId && !sessionId) {
      res.status(401).json({
        success: false,
        error: {
          message:
            "Não há usuário nem sessionId para calcular total do carrinho",
        },
      } as ApiResponse);
      return;
    }

    const total = await cartService.calculateCartTotal(
      userId || undefined,
      sessionId || undefined
    );

    res.status(200).json({
      success: true,
      data: { total },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao calcular total do carrinho");
  }
};

/**
 * @desc    Convert cart to order data
 * @route   GET /api/cart/checkout
 * @access  Private
 */
export const getCartCheckout = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    let userId = req.user?.id;
    let sessionId = req.sessionId;

    if (!userId && !sessionId) {
      res.status(401).json({
        success: false,
        error: {
          message: "Não há usuário nem sessionId para preparar checkout",
        },
      } as ApiResponse);
      return;
    }

    // Remover itens indisponíveis antes do checkout
    await cartService.removeUnavailableItems(
      userId || undefined,
      sessionId || undefined
    );

    const orderData = await cartService.convertCartToOrder(
      userId || undefined,
      sessionId || undefined
    );

    res.status(200).json({
      success: true,
      data: orderData,
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao preparar checkout");
  }
};
