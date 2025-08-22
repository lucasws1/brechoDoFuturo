import { Card, CardContent } from "@/components/ui/card";
import type { CartItem } from "@/contexts/CartContext";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";

export function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeFromCart } = useCart();
  const categoryName = item.category?.name;
  const categorySlug = item.category?.slug;

  // Usar a primeira imagem do array ou fallback
  const imageUrl =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : item.images?.[0] || "/placeholder-image.jpg";

  return (
    <Card className="w-full">
      <CardContent className="flex items-center gap-4 px-6">
        <img
          src={imageUrl}
          alt={item.name}
          className="h-24 w-24 rounded-lg object-cover"
        />
        <div className="flex w-full flex-col justify-between md:flex-row">
          <div className="flex flex-col">
            <Link to={`/product/${item.id}`}>
              <h3 className="font-semibold hover:underline">{item.name}</h3>
            </Link>
            <Link to={`/category/${categorySlug}`}>
              <p className="text-muted-foreground font-sans text-sm hover:underline">
                {categoryName || "Sem categoria"}
              </p>
            </Link>
            <p className="mt-1 font-sans text-lg font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(item.price)}
            </p>
          </div>
          <Separator className="my-1 block md:hidden" />
          <div className="flex min-w-24 items-center justify-between md:flex-col md:justify-center">
            <div className="flex items-center gap-2">
              {item.quantity > 1 && (
                <button
                  onClick={() => {
                    if (item.quantity > 1) {
                      updateQuantity(item.id, item.quantity - 1);
                    } else {
                      removeFromCart(item.id);
                    }
                  }}
                  className="hidden translate-y-[1px] cursor-pointer rounded-full md:block"
                >
                  <Minus className="h-4 w-4" />
                </button>
              )}
              <div className="text-sm">
                <p>
                  Qtd: <span className="ml-2 font-bold">{item.quantity}</span>
                </p>
              </div>
              <button
                className="cursor-pointer rounded-full"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
              {item.quantity > 1 && (
                <button
                  onClick={() => {
                    if (item.quantity > 1) {
                      updateQuantity(item.id, item.quantity - 1);
                    } else {
                      removeFromCart(item.id);
                    }
                  }}
                  className="cursor-pointer rounded-full md:hidden"
                >
                  <Minus className="h-4 w-4" />
                </button>
              )}
            </div>
            <div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="cursor-pointer"
              >
                <span className="block md:hidden">
                  <Trash2 className="h-4 w-4" />
                </span>
                <span className="hidden text-sm md:block">Remover</span>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
