import { useState, useEffect } from "react";
import api from "@/services/api";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[]; // Array de imagens do backend
  category: string;
  description: string;
  stock?: number;
}

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
    } catch (err) {
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

interface CategoryHierarchy {
  id: string;
  name: string;
  description?: string;
}

export const useCategoryHierarchy = (categorySlug: string | null) => {
  const [hierarchy, setHierarchy] = useState<CategoryHierarchy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug || categorySlug === "Explorar") {
      setHierarchy([]);
      return;
    }

    const fetchHierarchy = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/categories/${categorySlug}/hierarchy`);

        if (response.data.success) {
          setHierarchy(response.data.data);
        } else {
          setError("Erro ao buscar hierarquia da categoria");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.error?.message || "Erro ao buscar hierarquia",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHierarchy();
  }, [categorySlug]);

  return { hierarchy, loading, error };
};
