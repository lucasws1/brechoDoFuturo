import { useProductsContext } from "@/contexts/ProductsContext";
import type { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import ProductsGrid from "./ProductsGrid";

const MaisVendidosSection = () => {
  const { fetchProductsByCategory } = useProductsContext();
  const [maisVendidos, setMaisVendidos] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async (categoryName: string, limit: number) => {
      const items = await fetchProductsByCategory(categoryName, limit);
      if (mounted) {
        setMaisVendidos(items);
      }
    };
    fetchData("MaisVendidos", 5);
    return () => {
      mounted = false;
    };
  }, []);

  return <ProductsGrid products={maisVendidos} title="Mais vendidos" />;
};

export default MaisVendidosSection;
