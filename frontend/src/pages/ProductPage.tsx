import { useParams } from "react-router-dom";
import { useProductById } from "@/hooks/useProductById";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShoppingCart } from "lucide-react";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProductById(id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="w-full h-[400px] rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return null; // ou uma mensagem de "Produto não encontrado"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="w-full">
          <img
            src={product.image || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-4xl font-bold text-primary">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(product.price)}
          </p>
          <div>
            <h2 className="text-xl font-semibold mb-2">Descrição</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          <Button size="lg" className="w-full md:w-auto">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Adicionar ao Carrinho
          </Button>
        </div>
      </div>
    </div>
  );
}
