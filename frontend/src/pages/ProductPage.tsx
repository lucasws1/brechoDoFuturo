import { useParams } from "react-router-dom";
import { useProductById } from "@/hooks/useProductById";
import { useCart } from "@/contexts/CartContext"; // Importa o hook do carrinho
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProductById(id);
  const { addToCart } = useCart(); // Pega a função do contexto

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product.name} foi adicionado ao carrinho!`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="h-[400px] w-full rounded-lg" />
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
      <div className="grid items-start gap-8 md:grid-cols-2">
        <div className="w-full">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/400"}
            alt={product.name}
            className="h-auto w-full rounded-lg object-cover shadow-lg"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-primary text-4xl font-bold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(product.price)}
          </p>
          <div>
            <h2 className="mb-2 text-xl font-semibold">Descrição</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          <Button
            size="lg"
            className="w-full md:w-auto"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Adicionar ao Carrinho
          </Button>
        </div>
      </div>
    </div>
  );
}
