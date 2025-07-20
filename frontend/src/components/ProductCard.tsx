import type { Product } from "@/types/Product";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconShoppingCart } from "@tabler/icons-react";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
          <CardAction>
            <Button variant="link">
              <IconShoppingCart />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-full object-cover"
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-sm">{product.category}</p>
            <p className="text-sm">
              {product.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button>Adicionar ao carrinho</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
