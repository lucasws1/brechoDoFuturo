import { useProductsContext } from "@/contexts/ProductsContext";
import type { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import ProductsGrid from "./ProductsGrid";

const DestaquesSection = () => {
  const { fetchProductsByCategory } = useProductsContext();
  const [destaques, setDestaques] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async (category: string, limit: number) => {
      const products = await fetchProductsByCategory(category, limit, "newest");
      if (mounted) {
        setDestaques(products);
      }
    };
    fetchData("Destaques", 5);
    return () => {
      mounted = false;
    };
  }, []);

  return <ProductsGrid products={destaques} title="Destaques" />;
};

export default DestaquesSection;
