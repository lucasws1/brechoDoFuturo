import { ProductCard } from "@/components/ProductCard";
import { useProductsContext } from "@/contexts/ProductsContext";

export default function ProductPage() {
  const { products } = useProductsContext();

  return (
    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
