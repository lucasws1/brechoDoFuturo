import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import apiOld, { clearAuthState } from "../services/apiOld";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  type: "Admin" | "Customer";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  onAuthChange?: () => void; // Callback para notificar mudanças de auth
}

const AuthContextOld = createContext<AuthContextType | undefined>(undefined);

export const AuthProviderOld = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await apiOld.get("/auth/profile");
      setUser(response.data.data.user);
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário", error);
      logout(); // Limpa o estado se o token for inválido ou expirado
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUser();
    }
    setLoading(false);
  }, []);

  const login = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    apiOld.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    await fetchUser(); // Busca o usuário após o login
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    clearAuthState();
    toast.success("Logout realizado com sucesso!"); // Notificação de sucesso
    navigate("/auth");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContextOld.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContextOld.Provider>
  );
};

export const useAuthOld = () => {
  const context = useContext(AuthContextOld);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
