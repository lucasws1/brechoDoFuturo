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
import type { Product } from "../lib/mockProducts";

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
          {/* <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" />
              </div>
            </div>
          </form> */}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Adicionar ao carrinho
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
