import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type { Product } from "@/types/Product";
import { useAuth } from "./AuthContext"; // Importar AuthContext
import api from "@/services/api"; // Importar a instância da API

// Define o tipo para um item do carrinho (produto + quantidade)
export interface CartItem extends Product {
  quantity: number;
  itemId: string; // ID do item no carrinho (não do produto)
}

// Define o tipo para o valor do nosso contexto
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>; // Adicionar função para buscar o carrinho
}

// Cria o Context com um valor padrão undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook customizado para consumir o contexto facilmente
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// O componente Provedor que vai envolver nossa aplicação
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth(); // Obter usuário e status de autenticação do AuthContext
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar o carrinho do backend
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setCartItems([]); // Limpar carrinho se não estiver autenticado
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/cart");
      if (response.data.success) {
        // Mapear os itens do carrinho do backend para o formato CartItem
        const fetchedCartItems: CartItem[] = response.data.data.items.map(
          (item: any) => ({
            id: item.product.id, // ID do produto
            name: item.product.name,
            price: item.product.price,
            images: item.product.images,
            status: item.product.status,
            quantity: item.quantity,
            itemId: item.id, // ID do item no carrinho
          }),
        );
        setCartItems(fetchedCartItems);
      } else {
        setError(response.data.error?.message || "Erro ao buscar carrinho");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || "Erro de rede ao buscar carrinho",
      );
      console.error("Erro ao buscar carrinho:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Efeito para buscar o carrinho quando o status de autenticação ou o usuário mudar
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product: Product) => {
    if (!isAuthenticated || !user) {
      setError("Você precisa estar logado para adicionar itens ao carrinho.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/cart/items", {
        productId: product.id,
        quantity: 1, // Sempre adiciona 1 por vez na função addToCart
      });
      if (response.data.success) {
        await fetchCart(); // Recarrega o carrinho após adicionar
      } else {
        setError(
          response.data.error?.message || "Erro ao adicionar item ao carrinho",
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          "Erro de rede ao adicionar item ao carrinho",
      );
      console.error("Erro ao adicionar item ao carrinho:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated || !user) {
      setError("Você precisa estar logado para remover itens do carrinho.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Encontrar o itemId correspondente ao productId
      const itemToRemove = cartItems.find((item) => item.id === productId);
      if (!itemToRemove) {
        setError("Item não encontrado no carrinho.");
        setLoading(false);
        return;
      }
      const response = await api.delete(`/cart/items/${itemToRemove.itemId}`);
      if (response.data.success) {
        await fetchCart(); // Recarrega o carrinho após remover
      } else {
        setError(
          response.data.error?.message || "Erro ao remover item do carrinho",
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          "Erro de rede ao remover item do carrinho",
      );
      console.error("Erro ao remover item do carrinho:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated || !user) {
      setError("Você precisa estar logado para atualizar o carrinho.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const itemToUpdate = cartItems.find((item) => item.id === productId);
      if (!itemToUpdate) {
        setError("Item não encontrado no carrinho para atualização.");
        setLoading(false);
        return;
      }

      if (quantity <= 0) {
        // Se a quantidade for 0 ou menos, remove o item
        await removeFromCart(productId);
        return;
      }

      const response = await api.put(`/cart/items/${itemToUpdate.itemId}`, {
        quantity,
      });
      if (response.data.success) {
        await fetchCart(); // Recarrega o carrinho após atualizar
      } else {
        setError(
          response.data.error?.message ||
            "Erro ao atualizar quantidade do item",
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          "Erro de rede ao atualizar quantidade do item",
      );
      console.error("Erro ao atualizar quantidade do item:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user) {
      setError("Você precisa estar logado para limpar o carrinho.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete("/cart");
      if (response.data.success) {
        await fetchCart(); // Recarrega o carrinho após limpar
      } else {
        setError(response.data.error?.message || "Erro ao limpar carrinho");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || "Erro de rede ao limpar carrinho",
      );
      console.error("Erro ao limpar carrinho:", err);
    } finally {
      setLoading(false);
    }
  };

  // useMemo para calcular valores derivados de forma eficiente
  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    loading,
    error,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
