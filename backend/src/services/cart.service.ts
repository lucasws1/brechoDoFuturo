import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

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

interface CreateCartData {
  userId: string;
  sessionId?: string;
}

interface AddCartItemData {
  productId: string;
  quantity: number;
}

interface UpdateCartItemData {
  quantity: number;
}

// Buscar carrinho por usuário
export const getCartByUserId = async (userId: string) => {
  return await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              status: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
              seller: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

// Obter ou criar carrinho para usuário
export const getOrCreateCart = async (userId: string) => {
  let cart = await getCartByUserId(userId);

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                status: true,
                seller: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  return cart;
};

// Adicionar item ao carrinho
export const addItemToCart = async (
  userId: string,
  data: AddCartItemData
): Promise<CartValidationResult> => {
  const { productId, quantity } = data;

  // Validações básicas
  if (!productId || !quantity) {
    return {
      success: false,
      error: {
        code: "MISSING_FIELDS",
        message: "ID do produto e quantidade são obrigatórios",
      },
    };
  }

  if (quantity <= 0) {
    return {
      success: false,
      error: {
        code: "INVALID_QUANTITY",
        message: "Quantidade deve ser maior que zero",
      },
    };
  }

  // Verificar se produto existe e está disponível
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return {
      success: false,
      error: {
        code: "PRODUCT_NOT_FOUND",
        message: "Produto não encontrado",
      },
    };
  }

  if (product.status !== "Available") {
    return {
      success: false,
      error: {
        code: "PRODUCT_UNAVAILABLE",
        message: "Produto não está disponível",
      },
    };
  }

  // Verificar se há estoque suficiente
  if (product.stock < quantity) {
    return {
      success: false,
      error: {
        code: "INSUFFICIENT_STOCK",
        message: `Estoque insuficiente. Disponível: ${product.stock}, Solicitado: ${quantity}`,
        details: {
          available: product.stock,
          requested: quantity,
          productId: product.id,
          productName: product.name,
        },
      },
    };
  }

  // Verificar se o usuário não está tentando comprar seu próprio produto
  if (product.sellerId === userId) {
    return {
      success: false,
      error: {
        code: "OWN_PRODUCT",
        message: "Você não pode adicionar seu próprio produto ao carrinho",
      },
    };
  }

  try {
    // Obter ou criar carrinho
    const cart = await getOrCreateCart(userId);

    // Verificar se item já existe no carrinho
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    let item;
    if (existingItem) {
      // Verificar se há estoque suficiente para a nova quantidade total
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return {
          success: false,
          error: {
            code: "INSUFFICIENT_STOCK",
            message: `Estoque insuficiente. Disponível: ${product.stock}, Total solicitado: ${newQuantity}`,
            details: {
              available: product.stock,
              requested: newQuantity,
              productId: product.id,
              productName: product.name,
            },
          },
        };
      }

      // Atualizar quantidade
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
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
      });
    } else {
      // Criar novo item
      item = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
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
      });
    }

    return {
      success: true,
      data: item,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Erro interno do servidor",
      },
    };
  }
};

// Atualizar item do carrinho
export const updateCartItem = async (
  itemId: string,
  data: UpdateCartItemData,
  userId: string
): Promise<CartValidationResult> => {
  const { quantity } = data;

  // Validações básicas
  if (!quantity) {
    return {
      success: false,
      error: {
        code: "MISSING_FIELDS",
        message: "Quantidade é obrigatória",
      },
    };
  }

  if (quantity <= 0) {
    return {
      success: false,
      error: {
        code: "INVALID_QUANTITY",
        message: "Quantidade deve ser maior que zero",
      },
    };
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: {
        select: { userId: true },
      },
      product: {
        select: {
          id: true,
          stock: true,
          status: true,
          name: true,
        },
      },
    },
  });

  if (!item) {
    return {
      success: false,
      error: {
        code: "ITEM_NOT_FOUND",
        message: "Item do carrinho não encontrado",
      },
    };
  }

  // Verificar se o usuário é dono do carrinho
  if (item.cart.userId !== userId) {
    return {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Você não tem permissão para atualizar este item",
      },
    };
  }

  // Verificar se há estoque suficiente
  if (item.product.stock < data.quantity) {
    return {
      success: false,
      error: {
        code: "INSUFFICIENT_STOCK",
        message: `Estoque insuficiente. Disponível: ${item.product.stock}, Solicitado: ${data.quantity}`,
        details: {
          available: item.product.stock,
          requested: data.quantity,
          productId: item.product.id,
          productName: item.product.name,
        },
      },
    };
  }

  const updatedItem = await prisma.cartItem.update({
    where: { id: itemId },
    data,
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
  });

  return {
    success: true,
    data: updatedItem,
  };
};

// Remover item do carrinho
export const removeCartItem = async (
  itemId: string,
  userId: string
): Promise<CartValidationResult> => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: {
        select: { userId: true },
      },
    },
  });

  if (!item) {
    return {
      success: false,
      error: {
        code: "ITEM_NOT_FOUND",
        message: "Item do carrinho não encontrado",
      },
    };
  }

  // Verificar se o usuário é dono do carrinho
  if (item.cart.userId !== userId) {
    return {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Você não tem permissão para remover este item",
      },
    };
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return {
    success: true,
    data: item,
  };
};

// Limpar carrinho
export const clearCart = async (
  userId: string
): Promise<CartValidationResult> => {
  const cart = await getCartByUserId(userId);

  if (!cart) {
    return {
      success: false,
      error: {
        code: "CART_NOT_FOUND",
        message: "Carrinho não encontrado",
      },
    };
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return {
    success: true,
    data: cart,
  };
};

// Calcular total do carrinho
export const calculateCartTotal = async (userId: string): Promise<number> => {
  const cart = await getCartByUserId(userId);

  if (!cart) {
    return 0;
  }

  return cart.items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

// Remover itens indisponíveis do carrinho
export const removeUnavailableItems = async (userId: string) => {
  const cart = await getCartByUserId(userId);
  if (!cart || !cart.items) return;

  for (const item of cart.items) {
    if (item.product.status !== "Available") {
      await prisma.cartItem.delete({
        where: { id: item.id },
      });
    }
  }
};

// Converter carrinho em dados de pedido
export const convertCartToOrder = async (userId: string) => {
  const cart = await getCartByUserId(userId);

  if (!cart || !cart.items || cart.items.length === 0) {
    return {
      success: false,
      error: {
        code: "CART_EMPTY",
        message: "Carrinho vazio",
      },
    };
  }

  // Verificar se todos os produtos ainda estão disponíveis
  for (const item of cart.items) {
    if (item.product.status !== "Available") {
      return {
        success: false,
        error: {
          code: "PRODUCT_UNAVAILABLE",
          message: `Produto ${item.product.name} não está mais disponível`,
        },
      };
    }
  }

  // Retornar dados formatados para criar pedido
  return {
    success: true,
    data: {
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      })),
      totalPrice: cart.items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0),
    },
  };
};
