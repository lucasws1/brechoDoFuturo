// Utilitário para limpar completamente o estado de autenticação
// Use este script no console do navegador para resolver problemas de loop infinito

export const emergencyClearAuth = () => {
  // Limpa localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  // Limpa sessionStorage
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");

  // Limpa cookies relacionados
  document.cookie.split(";").forEach((c) => {
    const eqPos = c.indexOf("=");
    const name = eqPos > -1 ? c.substr(0, eqPos) : c;
    if (name.trim().includes("token") || name.trim().includes("auth")) {
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  });

  // Força reload da página
  window.location.reload();

  console.log("Estado de autenticação limpo de emergência");
};

// Função para verificar se há tokens válidos
export const checkAuthState = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  console.log("Estado atual de autenticação:");
  console.log("Access Token:", accessToken ? "Presente" : "Ausente");
  console.log("Refresh Token:", refreshToken ? "Presente" : "Ausente");

  return { accessToken, refreshToken };
};

// Função para limpar e redirecionar
export const clearAndRedirect = (path = "/auth") => {
  emergencyClearAuth();
  setTimeout(() => {
    window.location.href = path;
  }, 100);
};
