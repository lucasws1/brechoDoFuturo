import { CartItemCard } from "@/components/CartItemCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingOverlay } from "@/components/ui/loading";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

export function CartPage() {
  const { cartItems, totalItems, subtotal, loading } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="mb-4 text-3xl font-bold">Seu carrinho está vazio</h1>
        <p className="text-muted-foreground mb-6">
          Parece que você ainda não adicionou nenhum item.
        </p>
        <Button asChild>
          <Link to="/">Continuar Comprando</Link>
        </Button>
      </div>
    );
  }

  return (
    <LoadingOverlay isLoading={loading} text="Atualizando carrinho...">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">
          Seu Carrinho ({totalItems} itens)
        </h1>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Coluna da Lista de Produtos */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Coluna do Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(subtotal)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Frete</p>
                  <p className="font-medium">Grátis</p> {/* Mock */}
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <p>Total</p>
                  <p>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(subtotal)}{" "}
                    {/* Total = subtotal + frete */}
                  </p>
                </div>
                <Button size="lg" className="w-full" asChild>
                  <Link to="/checkout">Finalizar Compra</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}
