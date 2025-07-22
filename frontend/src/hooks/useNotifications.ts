import { useEffect } from "react";
import { toast } from "sonner";

interface UseNotificationsProps {
  error: string | null;
  loading?: boolean;
  success?: string | null;
  onErrorDismiss?: () => void;
  onSuccessDismiss?: () => void;
}

/**
 * Hook customizado para gerenciar notificações automáticas
 * Exibe toasts baseados no estado de error/success/loading
 */
export const useNotifications = ({
  error,
  loading = false,
  success = null,
  onErrorDismiss,
  onSuccessDismiss,
}: UseNotificationsProps) => {
  // Toast de erro automático
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        onDismiss: onErrorDismiss,
        action: {
          label: "Fechar",
          onClick: () => onErrorDismiss?.(),
        },
      });
    }
  }, [error, onErrorDismiss]);

  // Toast de sucesso automático
  useEffect(() => {
    if (success) {
      toast.success(success, {
        duration: 3000,
        onDismiss: onSuccessDismiss,
      });
    }
  }, [success, onSuccessDismiss]);

  // Toast de loading (opcional)
  useEffect(() => {
    let loadingToast: string | number | undefined;

    if (loading) {
      loadingToast = toast.loading("Processando...", {
        duration: Infinity, // Não remove automaticamente
      });
    }

    return () => {
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
    };
  }, [loading]);

  return {
    showError: (message: string) => toast.error(message),
    showSuccess: (message: string) => toast.success(message),
    showLoading: (message: string = "Carregando...") => toast.loading(message),
    showInfo: (message: string) => toast.info(message),
  };
};
