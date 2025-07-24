import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CartItem } from "@/contexts/CartContext";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";

export function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeFromCart } = useCart();

  // Usar a primeira imagem do array ou fallback
  const imageUrl =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : item.image || "/placeholder-image.jpg";

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <img
          src={imageUrl}
          alt={item.name}
          className="h-24 w-24 rounded-md object-cover"
        />
        <div className="flex-grow">
          <h3 className="font-serif font-semibold">{item.name}</h3>
          <p className="text-muted-foreground font-sans text-sm">
            {item.category || "Sem categoria"}
          </p>
          <p className="mt-1 font-sans text-lg font-bold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.price)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (item.quantity > 1) {
                updateQuantity(item.id, item.quantity - 1);
              } else {
                removeFromCart(item.id);
              }
            }}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            className="w-16 text-center"
            value={item.quantity}
            onChange={(e) =>
              updateQuantity(item.id, parseInt(e.target.value, 10) || 1)
            }
            min={1}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => removeFromCart(item.id)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
