import { toast } from "sonner";

interface ApiError {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
    status?: number;
  };
  message?: string;
}

/**
 * Hook global para interceptar e exibir erros de API
 * Pode ser usado em qualquer componente que faz chamadas de API
 */
export const useApiErrorHandler = () => {
  const handleApiError = (error: ApiError, customMessage?: string) => {
    let errorMessage = customMessage || "Ocorreu um erro inesperado";

    if (error.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Customizar mensagens para códigos de status específicos
    switch (error.response?.status) {
      case 401:
        errorMessage = "Sessão expirada. Faça login novamente.";
        break;
      case 403:
        errorMessage = "Você não tem permissão para realizar esta ação.";
        break;
      case 404:
        errorMessage = "Recurso não encontrado.";
        break;
      case 422:
        errorMessage =
          error.response.data?.error?.message || "Dados inválidos fornecidos.";
        break;
      case 500:
        errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
        break;
    }

    toast.error(errorMessage, {
      duration: 4000,
      action: {
        label: "Fechar",
        onClick: () => {},
      },
    });

    return errorMessage;
  };

  const handleApiSuccess = (message: string, duration: number = 3000) => {
    toast.success(message, { duration });
  };

  const handleApiLoading = (message: string = "Processando...") => {
    return toast.loading(message, { duration: Infinity });
  };

  const dismissToast = (toastId: string | number) => {
    toast.dismiss(toastId);
  };

  return {
    handleApiError,
    handleApiSuccess,
    handleApiLoading,
    dismissToast,
  };
};
