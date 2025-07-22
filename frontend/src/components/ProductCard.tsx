import { Link } from "react-router-dom";
import type { Product } from "@/types/Product";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  // Usar a primeira imagem do array ou fallback
  const imageUrl =
    product.images?.[0] || product.image || "/placeholder-image.jpg";

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Impede que o link seja acionado ao clicar no botão
    e.stopPropagation(); // Impede a propagação do evento para o Link pai
    addToCart(product);
    // Toast será exibido automaticamente pelo CartContext
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <Card className="w-full max-w-sm overflow-hidden transition-all duration-300 group-hover:shadow-xl">
        <CardHeader className="p-4">
          <CardTitle className="truncate">{product.name}</CardTitle>
          <CardDescription className="h-10 truncate">
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-2 p-4">
          <div className="flex w-full items-center justify-between">
            <p className="text-lg font-semibold">
              {product.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddToCart}
              disabled={(product.stock || 0) === 0}
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-muted-foreground flex w-full justify-between text-xs">
            <span
              className={`${
                (product.stock || 0) > 5
                  ? "text-green-600"
                  : (product.stock || 0) > 0
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {(product.stock || 0) === 0
                ? "Fora de estoque"
                : `${product.stock} em estoque`}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
