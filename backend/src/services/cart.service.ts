import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

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
export const addItemToCart = async (userId: string, data: AddCartItemData) => {
  const { productId, quantity } = data;

  if (quantity <= 0) {
    throw new Error("Quantidade deve ser maior que zero");
  }

  // Verificar se produto existe e está disponível
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Produto não encontrado");
  }

  if (product.status !== "Available") {
    throw new Error("Produto não está disponível");
  }

  // Verificar se há estoque suficiente
  if (product.stock < quantity) {
    throw new Error(
      `Estoque insuficiente. Disponível: ${product.stock}, Solicitado: ${quantity}`
    );
  }

  // Verificar se o usuário não está tentando comprar seu próprio produto
  if (product.sellerId === userId) {
    throw new Error("Você não pode adicionar seu próprio produto ao carrinho");
  }

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

  if (existingItem) {
    // Verificar se há estoque suficiente para a nova quantidade total
    const newQuantity = existingItem.quantity + quantity;
    if (product.stock < newQuantity) {
      throw new Error(
        `Estoque insuficiente. Disponível: ${product.stock}, Total solicitado: ${newQuantity}`
      );
    }

    // Atualizar quantidade
    return await prisma.cartItem.update({
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
  }

  // Criar novo item
  return await prisma.cartItem.create({
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
};

// Atualizar item do carrinho
export const updateCartItem = async (
  itemId: string,
  data: UpdateCartItemData,
  userId: string
) => {
  if (data.quantity <= 0) {
    throw new Error("Quantidade deve ser maior que zero");
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
        },
      },
    },
  });

  if (!item) {
    throw new Error("Item do carrinho não encontrado");
  }

  // Verificar se o usuário é dono do carrinho
  if (item.cart.userId !== userId) {
    throw new Error("Você não tem permissão para atualizar este item");
  }

  // Verificar se há estoque suficiente
  if (item.product.stock < data.quantity) {
    throw new Error(
      `Estoque insuficiente. Disponível: ${item.product.stock}, Solicitado: ${data.quantity}`
    );
  }

  return await prisma.cartItem.update({
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
};

// Remover item do carrinho
export const removeCartItem = async (itemId: string, userId: string) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: {
        select: { userId: true },
      },
    },
  });

  if (!item) {
    throw new Error("Item do carrinho não encontrado");
  }

  // Verificar se o usuário é dono do carrinho
  if (item.cart.userId !== userId) {
    throw new Error("Você não tem permissão para remover este item");
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });
};

// Limpar carrinho
export const clearCart = async (userId: string) => {
  const cart = await getCartByUserId(userId);

  if (!cart) {
    throw new Error("Carrinho não encontrado");
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
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
    throw new Error("Carrinho vazio");
  }

  // Verificar se todos os produtos ainda estão disponíveis
  for (const item of cart.items) {
    if (item.product.status !== "Available") {
      throw new Error(`Produto ${item.product.name} não está mais disponível`);
    }
  }

  // Retornar dados formatados para criar pedido
  return {
    items: cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
    })),
    totalPrice: cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0),
  };
};
