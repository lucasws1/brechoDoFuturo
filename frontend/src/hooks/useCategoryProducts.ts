import { useState, useEffect } from "react";
import api from "@/services/api";
import type { Product } from "@/types/Product";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
  pagination: PaginationInfo;
}

interface UseCategoryProductsOptions {
  categorySlug: string;
  subcategory?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

interface UseCategoryProductsReturn {
  products: Product[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCategoryProducts({
  categorySlug,
  subcategory,
  sort = "newest",
  page = 1,
  limit = 12,
}: UseCategoryProductsOptions): UseCategoryProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir query params
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
      });

      // Usar subcategoria se fornecida, senão usar categoria principal
      const categoryParam = subcategory || categorySlug;
      params.append("category", categoryParam);

      const response = await api.get(`/products?${params.toString()}`);
      const data: ApiResponse = response.data;

      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error("Erro ao buscar produtos");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      console.error("Erro ao buscar produtos da categoria:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categorySlug) {
      fetchProducts();
    }
  }, [categorySlug, subcategory, sort, page, limit]);

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    pagination,
    loading,
    error,
    refetch,
  };
}
