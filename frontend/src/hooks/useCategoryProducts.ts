import { useState, useEffect } from "react";
import api from "@/services/api";
import type { Product } from "@/types/Product";
import { useProductsSearchParams } from "./useProductsSearchParams";

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

interface UseCategoryProductsReturn {
  products: Product[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCategoryProducts(): UseCategoryProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { params, sub, page, limit, sort, search, slug } =
    useProductsSearchParams();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
      });

      const categoryParam = sub || slug;
      params.append("category", categoryParam);

      if (search) params.append("search", search);

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
    fetchProducts();
  }, [params, slug, sub, page, limit, sort, search]);

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
