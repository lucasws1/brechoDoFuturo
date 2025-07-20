import { useState, useEffect } from "react";

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

      const apiUrl = `http://localhost:3001/api/products/${productId}`;
      const response = await fetch(apiUrl);
      console.log("Fetching product from:", apiUrl);

      if (!response.ok) {
        throw new Error(`Produto não encontrado: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

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
