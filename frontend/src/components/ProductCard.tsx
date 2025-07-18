import { IconShoppingCart } from "@tabler/icons-react";
import type { Product } from "../lib/mockProducts";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <Card key={product.id} className="w-full">
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
          <CardAction>
            <Button size="sm">
              <IconShoppingCart />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>{product.description}</p>
        </CardContent>
        <CardFooter>
          <p>{product.price}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
