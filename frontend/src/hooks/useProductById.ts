import { useState, useEffect } from "react";
import api from "@/services/api";
import type { Product } from "@/types/Product";

interface ApiResponse {
  success: boolean;
  data: Product;
}

interface UseProductByIdReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProductById(productId?: string): UseProductByIdReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!productId) {
      setError("ID do produto não fornecido.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/products/${productId}`);
      const data: ApiResponse = response.data;

      if (data.success) {
        setProduct(data.data);
      } else {
        throw new Error("Erro ao buscar dados do produto");
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setProduct(null);
      console.error("Erro ao buscar produto:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const refetch = () => {
    fetchProduct();
  };

  return {
    product,
    loading,
    error,
    refetch,
  };
}
