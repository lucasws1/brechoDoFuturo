import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// 1. Schema de Validação com Zod
const checkoutSchema = z.object({
  name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  address: z.string().min(5, "Endereço é obrigatório"),
  city: z.string().min(3, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  zip: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  paymentMethod: z.enum(["credit-card", "pix", "boleto"], {
    message: "Escolha um método de pagamento",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "credit-card", // Valor padrão
    },
  });

  // 2. Função de Submissão (Simulação)
  const onSubmit = (data: CheckoutFormValues) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Pedido Enviado:", {
          ...data,
          items: cartItems,
          subtotal,
        });
        toast.success("Compra realizada com sucesso!");
        clearCart();
        navigate("/"); // Redireciona para a home (ou uma página de sucesso)
        resolve(undefined);
      }, 2000);
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="font-serif text-2xl font-bold">
          Seu carrinho está vazio.
        </h1>
        <p className="text-muted-foreground mt-2 font-sans">
          Adicione itens para finalizar a compra.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center font-serif text-3xl font-bold">
        Finalizar Compra
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-8 lg:grid-cols-3"
      >
        {/* Coluna de Formulários */}
        <div className="space-y-6 lg:col-span-2">
          {/* Informações de Entrega */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" {...register("address")} />
                {errors.address && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" {...register("city")} />
                {errors.city && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input id="state" {...register("state")} />
                {errors.state && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.state.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="zip">CEP</Label>
                <Input id="zip" {...register("zip")} />
                {errors.zip && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.zip.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle>Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Aqui viria a lógica de seleção de pagamento */}
              <p className="text-muted-foreground">
                Funcionalidade de pagamento simulada.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coluna de Resumo */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-sm">
                      Qtd: {item.quantity}
                    </p>
                  </div>
                  <p>
                    {(item.price * item.quantity).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>
                  {subtotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Frete</p>
                <p>Grátis</p>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <p>Total</p>
                <p>
                  {subtotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processando..." : "Finalizar Compra"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
