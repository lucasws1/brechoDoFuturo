import api from "@/services/api";
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
  fetchProductsByCategory: (
    category: string,
    limit: number,
  ) => Promise<Product[]>;
  fetchOfertaEspecial: () => Promise<Product[]>;
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

  const { limit = 12 } = options;

  const fetchProductsByCategory = async (
    categoryName: string,
    limit: number = 5,
  ): Promise<Product[]> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      category: categoryName,
    });

    const response = await api.get(`/products?${params.toString()}`);
    const data: ApiResponse = response.data;
    return data.data;
  };

  const fetchOfertaEspecial = async (): Promise<Product[]> => {
    const params = new URLSearchParams({
      limit: "4",
      category: "Ofertas",
    });

    const response = await api.get(`/products?${params.toString()}`);
    const data: ApiResponse = response.data;
    return data.data;
  };

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

      const response = await api.get(`/products?${params.toString()}`);

      const data: ApiResponse = response.data;

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
    // Se a categoria selecionada for a mesma, desmarcar
    // Se for diferente, selecionar a nova categoria
    setSelectedCategory(
      category === selectedCategory || category === "Explorar" ? "" : category,
    );
    setCurrentPage(1); // Reset para primeira página
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const refetch = () => {
    fetchProducts();
    setSelectedCategory(""); // Resetar categoria ao refazer a busca
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
    fetchProductsByCategory,
    fetchOfertaEspecial,
  };
}
