import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/lib/mockProducts";

const Home = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      <button className="bg-primary text-primary-foreground rounded px-4 py-2">
        Teste de cor
      </button>
      <Button>Teste de cor</Button>
    </div>
  );
};

export default Home;
