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
import { useNotifications } from "@/hooks/useNotifications"; // Hook de notificações
import api from "@/services/api"; // Importar a instância da API

// Define o tipo para um item do carrinho (produto + quantidade)
export interface CartItem extends Product {
  quantity: number;
  itemId: string; // ID do item no carrinho (não do produto)
}

// Define o tipo para o valor do nosso contexto
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  loading: boolean;
  error: string | null;
  fetchCart: (silent?: boolean) => Promise<void>; // Adicionar função para buscar o carrinho
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hook para notificações automáticas
  useNotifications({
    error,
    loading,
    success: successMessage,
    onErrorDismiss: () => setError(null),
    onSuccessDismiss: () => setSuccessMessage(null),
  });

  // Limpar mensagens de sucesso automaticamente após um curto delay
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 100); // Pequeno delay para garantir que a notificação seja exibida
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Limpar mensagens de erro automaticamente após um curto delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 100); // Pequeno delay para garantir que a notificação seja exibida
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Função para buscar o carrinho do backend
  const fetchCart = useCallback(
    async (silent: boolean = true) => {
      if (!isAuthenticated || !user) {
        setCartItems([]); // Limpar carrinho se não estiver autenticado
        return;
      }
      if (!silent) {
        setLoading(true);
      }
      setError(null);
      try {
        const response = await api.get("/cart");
        if (
          response.data.success &&
          response.data.data &&
          response.data.data.items
        ) {
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
          // Se não há carrinho ou itens, inicializar como array vazio
          setCartItems([]);
          if (response.data.error) {
            setError(response.data.error.message);
          }
        }
      } catch (err: any) {
        // Se há erro 404 (carrinho não existe), isso é normal para novos usuários
        if (err.response?.status === 404) {
          setCartItems([]);
        } else {
          setError(
            err.response?.data?.error?.message ||
              "Erro de rede ao buscar carrinho",
          );
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [isAuthenticated, user],
  );

  // Efeito para buscar o carrinho quando o status de autenticação ou o usuário mudar
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Limpeza dos estados ao desmontar o componente
  useEffect(() => {
    return () => {
      setError(null);
      setSuccessMessage(null);
    };
  }, []);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!isAuthenticated || !user) {
      setError("Você precisa estar logado para adicionar itens ao carrinho.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/cart/items", {
        productId: product.id,
        quantity, // Usar a quantidade passada como parâmetro
      });
      if (response.data.success) {
        await fetchCart(false); // Recarrega o carrinho após adicionar (com loading)
        setSuccessMessage(
          quantity === 1
            ? `${product.name} foi adicionado ao carrinho!`
            : `${quantity} unidades de ${product.name} foram adicionadas ao carrinho!`,
        );
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
        await fetchCart(false); // Recarrega o carrinho após remover (com loading)
        setSuccessMessage("Item removido do carrinho");
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
        await fetchCart(false); // Recarrega o carrinho após atualizar (com loading)
        setSuccessMessage("Quantidade atualizada");
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
        await fetchCart(false); // Recarrega o carrinho após limpar (com loading)
        setSuccessMessage("Carrinho limpo");
      } else {
        setError(response.data.error?.message || "Erro ao limpar carrinho");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || "Erro de rede ao limpar carrinho",
      );
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
