import type { Product } from "@/types/Product"; // Importando o tipo Product
import { useState, useEffect } from "react";

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

interface UseProductsOptions {
  limit?: number;
}

interface UseProductsReturn {
  products: Product[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  searchTerm: string;
  selectedCategory: string;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleCategoryChange: (category: string) => void;
  refetch: () => void;
}

export function useProducts(
  options: UseProductsOptions = {},
): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { limit = 15 } = options;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir query params
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);

      // URL da API
      const apiUrl = `http://localhost:3001/api/products?${params.toString()}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(
          `Erro na requisição: ${response.status} ${response.statusText}`,
        );
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error("Erro ao buscar produtos");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro ao buscar produtos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, limit, searchTerm, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset para primeira página
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    setCurrentPage(1); // Reset para primeira página
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const refetch = () => {
    fetchProducts();
    // setSelectedCategory(""); // Resetar categoria ao refazer a busca
    setSearchTerm(""); // Resetar termo de busca ao refazer a busca
    setCurrentPage(1); // Resetar para a primeira página
  };

  return {
    products,
    pagination,
    loading,
    error,
    currentPage,
    searchTerm,
    selectedCategory,
    setCurrentPage: handlePageChange,
    setSearchTerm,
    setSelectedCategory,
    handleSearch,
    handleCategoryChange,
    refetch,
  };
}
