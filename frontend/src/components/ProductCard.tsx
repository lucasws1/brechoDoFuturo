import { Link } from "react-router-dom";
import type { Product } from "@/types/Product";
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
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Impede que o link seja acionado ao clicar no botão
    e.stopPropagation(); // Impede a propagação do evento para o Link pai
    console.log(`Produto ${product.name} adicionado ao carrinho!`);
    // Aqui você adicionaria a lógica do seu context de carrinho
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <Card className="w-full max-w-sm overflow-hidden transition-all duration-300 group-hover:shadow-xl">
        <CardHeader className="p-4">
          <CardTitle className="truncate">{product.name}</CardTitle>
          <CardDescription className="truncate h-10">
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center">
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
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
