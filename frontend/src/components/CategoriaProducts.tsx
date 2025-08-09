import { useProductsContext } from "@/contexts/ProductsContext";
import type { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import ProductsGrid from "./ProductsGrid";

const CategoriaProducts = ({ category }: { category: string }) => {
  const { fetchProductsByCategory } = useProductsContext();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const products = await fetchProductsByCategory(category, 10);
      if (mounted) {
        setProducts(products);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [category]);

  return <ProductsGrid products={products} title={category} />;
};

export default CategoriaProducts;
