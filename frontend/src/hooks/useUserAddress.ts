import { useCallback, useState } from "react";
import api from "@/services/api";

export interface Address {
  id: string;
  label?: string | null;
  street: string;
  number: string;
  complement?: string | null;
  district: string;
  city: string;
  state: string;
  cep: string;
  isDefault: boolean;
}

export function useUserAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async (): Promise<Address[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/address");
      return (response.data.data ?? []) as Address[];
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao buscar endereços",
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchAddresses };
}
