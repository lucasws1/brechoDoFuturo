// useProductsFetch.ts
import { useEffect, useState } from "react";
import api from "@/services/api";
import type { Product } from "@/types/Product";

export function useProductsFetch({
  category,
  sort = "newest",
  limit = 5,
}: {
  category: string;
  sort?: string;
  limit?: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = new URLSearchParams({
    category,
    sort,
    limit: limit.toString(),
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/products?${params.toString()}`);
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.error?.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, sort, limit]);

  return { products, loading, error };
}
