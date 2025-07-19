import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/lib/mockProducts";
import { Card } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="space-y-8 p-8">
      {/* Teste básico de cores e estilos Tailwind v4 */}
      <div className="space-y-4">
        <h1 className="text-foreground text-3xl font-bold">
          Teste Tailwind v4 + shadcn/ui
        </h1>

        {/* Teste de botões shadcn */}
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Botão Padrão</Button>
          <Button variant="secondary">Botão Secundário</Button>
          <Button variant="destructive">Botão Destrutivo</Button>
          <Button variant="outline">Botão Outline</Button>
          <Button variant="ghost">Botão Ghost</Button>
        </div>

        {/* Teste de cores personalizadas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-primary text-primary-foreground rounded-lg p-4">
            Cor Primary
          </div>
          <div className="bg-secondary text-secondary-foreground rounded-lg p-4">
            Cor Secondary
          </div>
          <div className="bg-muted text-muted-foreground rounded-lg p-4">
            Cor Muted
          </div>
        </div>

        {/* Teste de Card shadcn */}
        <Card className="p-6">
          <h2 className="mb-2 text-xl font-semibold">Card Teste</h2>
          <p className="text-muted-foreground">
            Este é um teste do componente Card do shadcn/ui com Tailwind v4.
          </p>
        </Card>
      </div>

      {/* Componentes originais */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Produtos</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
