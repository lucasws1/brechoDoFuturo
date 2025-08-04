import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "http://localhost:3001/api", // TODO: Mover para .env
});

// Controle de refresh token para evitar loops infinitos
let isRefreshing = false;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;
const REFRESH_TIMEOUT = 10000; // 10 segundos

// Função para limpar tokens e redirecionar
const clearAuthAndRedirect = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  delete api.defaults.headers.common["Authorization"];

  // Força reload da página para limpar qualquer estado em cache
  if (window.location.pathname !== "/auth") {
    window.location.href = "/auth";
  }
};

// Função para limpar completamente o estado de autenticação
export const clearAuthState = () => {
  // Reset das variáveis de controle
  isRefreshing = false;
  refreshAttempts = 0;

  // Limpa tokens
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  delete api.defaults.headers.common["Authorization"];

  console.log("Estado de autenticação limpo");
};

// Interceptor para adicionar o token de acesso a cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para lidar com refresh token e notificações de erro
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Evitar notificações para alguns endpoints específicos
    const silentEndpoints = ["/auth/refresh", "/cart"];
    const shouldShowToast = !silentEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint),
    );

    // Se o erro for 401 (Unauthorized) e não for uma requisição de refresh token já em andamento
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca a requisição original para evitar loops infinitos

      // Verifica se já excedeu o número máximo de tentativas
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        console.error("Máximo de tentativas de refresh excedido");
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken && !isRefreshing) {
        isRefreshing = true;
        refreshAttempts++;

        try {
          // Timeout para evitar que a requisição fique pendente indefinidamente
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(
              () => reject(new Error("Refresh timeout")),
              REFRESH_TIMEOUT,
            );
          });

          const refreshPromise = api.post("/auth/refresh", { refreshToken });

          const response = (await Promise.race([
            refreshPromise,
            timeoutPromise,
          ])) as any;

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          api.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;

          // Reset do contador de tentativas em caso de sucesso
          refreshAttempts = 0;
          isRefreshing = false;

          // Retenta a requisição original com o novo token
          return api(originalRequest);
        } catch (refreshError: any) {
          console.error("Erro ao renovar token:", refreshError);

          // Se excedeu tentativas ou erro de timeout, limpa tudo
          if (
            refreshAttempts >= MAX_REFRESH_ATTEMPTS ||
            refreshError.message === "Refresh timeout"
          ) {
            clearAuthAndRedirect();

            if (shouldShowToast) {
              toast.error("Sessão expirada. Faça login novamente.");
            }
          }

          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      } else if (shouldShowToast) {
        toast.error("Acesso negado. Faça login para continuar.");
      }
    }

    // Notificações para outros tipos de erro (opcional)
    if (shouldShowToast && error.response?.status >= 500) {
      toast.error("Erro do servidor. Tente novamente mais tarde.");
    }

    return Promise.reject(error);
  },
);

export default api;
