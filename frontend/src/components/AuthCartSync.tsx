import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

// Componente que sincroniza mudanças de autenticação com o carrinho
export const AuthCartSync = () => {
  const { isAuthenticated, user } = useAuth();
  const { fetchCart } = useCart();

  // Efeito para sincronizar o carrinho quando o status de autenticação mudar
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, user, fetchCart]);

  // Este componente não renderiza nada, apenas sincroniza os contextos
  return null;
};
