import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

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
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  onAuthChange?: () => void; // Callback para notificar mudanças de auth
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const refreshInFlight = useRef<Promise<string> | null>(null);
  const tokenRenewalTimer = useRef<NodeJS.Timeout | null>(null);

  // Função para verificar o tempo restante do token
  const checkTokenExpiry = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = payload.exp - now;
      console.log(`⏰ Token expira em ${Math.floor(timeLeft / 60)} minutos`);
      return timeLeft;
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      return 0;
    }
  };

  // Função para configurar renovação automática do token
  const scheduleTokenRenewal = (token: string) => {
    // Limpa timer anterior se existir
    if (tokenRenewalTimer.current) {
      clearTimeout(tokenRenewalTimer.current);
    }

    const timeLeft = checkTokenExpiry(token);

    // Se o token expira em menos de 1 minuto, renova imediatamente
    if (timeLeft <= 60) {
      console.log(
        "🚨 Token expirando em menos de 1 minuto, renovando imediatamente...",
      );
      refreshTokenProactively();
      return;
    }

    // Agenda renovação para 5 minutos antes da expiração
    const renewalTime = Math.max((timeLeft - 300) * 1000, 60000); // mínimo 1 minuto
    console.log(
      `⏱️ Renovação agendada para ${Math.floor(renewalTime / 1000 / 60)} minutos`,
    );

    tokenRenewalTimer.current = setTimeout(() => {
      console.log("🔄 Executando renovação automática do token...");
      refreshTokenProactively();
    }, renewalTime);
  };

  // Função para renovar token proativamente
  const refreshTokenProactively = async () => {
    if (refreshInFlight.current) {
      console.log("🔄 Renovação já em andamento, aguardando...");
      return refreshInFlight.current;
    }

    try {
      refreshInFlight.current = (async () => {
        console.log("🔄 Renovando token proativamente...");
        const { data } = await api.post("/auth/refresh");
        const newAT = data.data.accessToken;
        setAccessToken(newAT);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAT}`;
        console.log("✅ Token renovado proativamente com sucesso");

        // Agenda próxima renovação
        scheduleTokenRenewal(newAT);

        return newAT;
      })().finally(() => {
        refreshInFlight.current = null;
      });

      return await refreshInFlight.current;
    } catch (error) {
      console.error("❌ Erro na renovação proativa:", error);
      // Se falhar, agenda uma nova tentativa em 1 minuto
      tokenRenewalTimer.current = setTimeout(() => {
        refreshTokenProactively();
      }, 60000);
      throw error;
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUser(response.data.data.user);
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário", error);
      logout();
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }

    // Limpa timer de renovação
    if (tokenRenewalTimer.current) {
      clearTimeout(tokenRenewalTimer.current);
      tokenRenewalTimer.current = null;
    }

    setUser(null);
    setAccessToken(null);
    delete api.defaults.headers.common["Authorization"];
    navigate("/");
  };

  // 1 - Inicialização: tenta /api/auth/refresh para obter um AT
  useEffect(() => {
    (async () => {
      try {
        console.log("🔄 Inicializando auth, tentando refresh token...");
        const { data } = await api.post("/auth/refresh");
        const at = data.data.accessToken;
        setAccessToken(at);
        api.defaults.headers.common["Authorization"] = `Bearer ${at}`;

        // Agenda renovação automática
        scheduleTokenRenewal(at);

        await fetchUser();
      } catch (error) {
        setUser(null);
        setAccessToken(null);
        console.error("Erro ao buscar perfil do usuário", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2 - Interceptor de 401 com fila/lock para não spammar /refresh
  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config;

        // Não tentar refresh para rotas de logout
        if (original.url?.includes("/auth/logout")) {
          return Promise.reject(error);
        }

        if (error.response?.status !== 401 || original._retry) {
          return Promise.reject(error);
        }
        original._retry = true;

        console.log("🚨 Erro 401 detectado, tentando refresh token...");

        try {
          if (!refreshInFlight.current) {
            refreshInFlight.current = (async () => {
              console.log("🔄 Tentando refresh token...");
              const { data } = await api.post("/auth/refresh");
              const newAT = data.data.accessToken;
              setAccessToken(newAT);
              api.defaults.headers.common["Authorization"] = `Bearer ${newAT}`;
              console.log("✅ Token renovado com sucesso");

              // Agenda próxima renovação após renovação por 401
              scheduleTokenRenewal(newAT);

              return newAT;
            })().finally(() => {
              refreshInFlight.current = null;
            });
          }
          const token = await refreshInFlight.current;
          original.headers.Authorization = `Bearer ${token}`;
          console.log("🔄 Reenviando requisição com novo token...");
          return api(original);
        } catch (refreshError) {
          console.error("❌ Erro ao renovar token:", refreshError);
          await logout();
          return Promise.reject(refreshError);
        }
      },
    );
    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [logout]); // Adicionar logout nas dependências

  // Cleanup do timer quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (tokenRenewalTimer.current) {
        clearTimeout(tokenRenewalTimer.current);
      }
    };
  }, []);

  // 3 - Ações
  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });

    const at = data.data.accessToken;
    setAccessToken(at);
    api.defaults.headers.common["Authorization"] = `Bearer ${at}`;

    // Agenda renovação automática após login
    scheduleTokenRenewal(at);

    await fetchUser();
    navigate("/");
  };

  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loading,
      login,
      logout,
      isAuthenticated,
      refreshUser: fetchUser,
    }),
    [user, accessToken, loading, login, logout, isAuthenticated, fetchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
