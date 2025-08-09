import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/Product";

interface ProductsContextType {
  products: any[];
  pagination: any;
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

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

interface ProductsProviderProps {
  children: ReactNode;
}

export function ProductsProvider({ children }: ProductsProviderProps) {
  const productsState = useProducts();

  return (
    <ProductsContext.Provider value={productsState}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error(
      "useProductsContext deve ser usado dentro de ProductsProvider",
    );
  }
  return context;
}
