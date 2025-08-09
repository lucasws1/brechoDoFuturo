import { useProductsContext } from "@/contexts/ProductsContext";
import type { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import ProductsGrid from "./ProductsGrid";

const NovidadesSection = () => {
  const { fetchProductsByCategory } = useProductsContext();
  const [newProducts, setNewProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async (category: string, limit: number) => {
      const products = await fetchProductsByCategory(category, limit);
      if (mounted) {
        setNewProducts(products);
      }
    };
    fetchData("Novidades", 5);
    return () => {
      mounted = false;
    };
  }, []);

  return <ProductsGrid products={newProducts} title="Novidades" />;
};

export default NovidadesSection;
