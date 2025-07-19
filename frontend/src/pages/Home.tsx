import { ProductCard } from "@/components/ProductCard";
import { mockProducts } from "@/lib/mockProducts";

const Home = () => {
  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Produtos</h2>
        <p className="text-muted-foreground text-sm">
          Encontre os melhores produtos para você
        </p>
        <div className="grid grid-cols-4 gap-4">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
