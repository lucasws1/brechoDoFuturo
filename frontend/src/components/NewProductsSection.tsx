import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import type { Product } from "@/types/Product";
import { useProductsContext } from "@/contexts/ProductsContext";

const NewProductsSection = () => {
  const { fetchNewProducts } = useProductsContext();
  const [newProducts, setNewProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchNewProducts().then((products: Product[]) => {
      setNewProducts(products);
    });
  }, []);

  return (
    <div className="mt-12 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-black">Novidades</h1>
      <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {newProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default NewProductsSection;
