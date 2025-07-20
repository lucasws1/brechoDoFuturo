import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api", // TODO: Mover para .env
});

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
  }
);

// Interceptor para lidar com refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Se o erro for 401 (Unauthorized) e não for uma requisição de refresh token já em andamento
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca a requisição original para evitar loops infinitos
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const response = await api.post("/auth/refresh", { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

          // Retenta a requisição original com o novo token
          return api(originalRequest);
        } catch (refreshError) {
          // Se o refresh token falhar, desloga o usuário
          console.error("Erro ao renovar token, deslogando...", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/auth"; // Redireciona para a página de login
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
