import { useProductsContext } from "@/contexts/ProductsContext";
import type { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";

const MaisVendidos = () => {
  const { fetchMaisVendidos } = useProductsContext();
  const [maisVendidos, setMaisVendidos] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const items = await fetchMaisVendidos();
      setMaisVendidos(items);
    };
    fetchData();
  }, []);
  return (
    <section className="mt-8">
      <div className="p-4">
        <h2 className="text-2xl font-bold tracking-tight text-black">
          Mais Vendidos
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {maisVendidos.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MaisVendidos;
