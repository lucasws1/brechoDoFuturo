import { useParams } from "react-router-dom";
import { useProductById } from "@/hooks/useProductById";
import { useCart } from "@/contexts/CartContext"; // Importa o hook do carrinho
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProductById(id);
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const [localQuantity, setLocalQuantity] = useState(1);

  // Encontrar a quantidade atual do produto no carrinho
  const cartItem = cartItems.find((item) => item.id === id);
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      // Toast será exibido automaticamente pelo CartContext
    }
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    } else {
      setLocalQuantity((prev) => Math.min(prev + 1, product?.stock || 1));
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(cartItem.id, cartItem.quantity - 1);
      } else {
        removeFromCart(cartItem.id);
      }
    } else {
      setLocalQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleAddMultiple = () => {
    if (product) {
      addToCart(product, localQuantity);
      setLocalQuantity(1);
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
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            {product.name}
          </h1>
          <p className="text-primary font-sans text-4xl font-bold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(product.price)}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Estoque:</span>
            <span
              className={`text-sm font-medium ${
                (product.stock || 0) > 5
                  ? "text-green-600"
                  : (product.stock || 0) > 0
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {product.stock || 0} unidade(s) disponível(is)
            </span>
          </div>

          {quantityInCart > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                No carrinho:
              </span>
              <span className="text-sm font-medium text-blue-600">
                {quantityInCart} unidade(s)
              </span>
            </div>
          )}

          <div>
            <h2 className="mb-2 font-serif text-xl font-semibold">Descrição</h2>
            <p className="text-muted-foreground font-sans">
              {product.description}
            </p>
          </div>

          {cartItem ? (
            // Se já está no carrinho, mostrar controles de quantidade
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  Quantidade no carrinho:
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDecrement}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {cartItem.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleIncrement}
                    disabled={(product.stock || 0) <= cartItem.quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full md:w-auto"
                onClick={handleAddToCart}
                disabled={(product.stock || 0) <= cartItem.quantity}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar Mais ao Carrinho
              </Button>
            </div>
          ) : (
            // Se não está no carrinho, mostrar botão de adicionar com quantidade
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantidade:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDecrement}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {localQuantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleIncrement}
                    disabled={(product.stock || 0) <= localQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full md:w-auto"
                onClick={
                  localQuantity === 1 ? handleAddToCart : handleAddMultiple
                }
                disabled={(product.stock || 0) === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {(product.stock || 0) === 0
                  ? "Fora de Estoque"
                  : localQuantity === 1
                    ? "Adicionar ao Carrinho"
                    : `Adicionar ${localQuantity} ao Carrinho`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
