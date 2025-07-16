import { Request, Response } from "express";
import * as cartService from "../services/cart.service";
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

interface AddCartItemInput {
  productId: string;
  quantity: number;
}

interface UpdateCartItemInput {
  quantity: number;
}

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
    }

    const cart = await cartService.getCartByUserId(req.user.id);

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
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
    }

    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        error: { message: "ID do produto e quantidade são obrigatórios" },
      } as ApiResponse);
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: { message: "Quantidade deve ser maior que zero" },
      } as ApiResponse);
    }

    const itemData: AddCartItemInput = {
      productId,
      quantity: Number(quantity),
    };

    const item = await cartService.addItemToCart(req.user.id, itemData);

    res.status(201).json({
      success: true,
      data: {
        message: "Item adicionado ao carrinho com sucesso",
        item,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao adicionar item ao carrinho");
  }
};

/**
 * @desc    Update cart item
 * @route   PUT /api/cart/items/:itemId
 * @access  Private
 */
export const updateCartItem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: { message: "Quantidade deve ser maior que zero" },
      } as ApiResponse);
    }

    const updateData: UpdateCartItemInput = {
      quantity: Number(quantity),
    };

    const item = await cartService.updateCartItem(
      itemId,
      updateData,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: {
        message: "Item atualizado com sucesso",
        item,
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
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
    }

    const { itemId } = req.params;
    await cartService.removeCartItem(itemId, req.user.id);

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
export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
    }

    await cartService.clearCart(req.user.id);

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
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
    }

    const total = await cartService.calculateCartTotal(req.user.id);

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
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
    }

    // Remover itens indisponíveis antes do checkout
    await cartService.removeUnavailableItems(req.user.id);

    const orderData = await cartService.convertCartToOrder(req.user.id);

    res.status(200).json({
      success: true,
      data: orderData,
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao preparar checkout");
  }
};
