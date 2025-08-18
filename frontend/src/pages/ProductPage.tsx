import { useParams } from "react-router-dom";
import { useProductById } from "@/hooks/useProductById";
import { useCart } from "@/contexts/CartContext"; // Importa o hook do carrinho
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import BreadcrumbCustom from "@/components/BreadcrumbCustom";
import { Helmet } from "react-helmet-async";
import ProductGallery, { type ImageItem } from "@/components/ProductGallery";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProductById(id);
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const [localQuantity, setLocalQuantity] = useState(1);

  const images = product?.images?.map((image) => ({
    url: image,
    alt: product?.name,
  })) as ImageItem[];

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
    <div className="mx-auto w-full max-w-7xl px-6 py-0">
      <Helmet>
        <title>
          {product
            ? `${product.name} | Brechó do Futuro`
            : "Produto | Brechó do Futuro"}
        </title>
        <meta
          name="description"
          content={
            product
              ? `${product.name} - ${product.description}`
              : "Produto do Brechó do Futuro"
          }
        />
        <meta
          property="og:title"
          content={product ? product.name : "Produto"}
        />
        <meta
          property="og:description"
          content={
            product ? product.description : "Produto do Brechó do Futuro"
          }
        />
        <meta property="og:image" content={product?.images?.[0] || ""} />
        <link
          rel="canonical"
          href={`${window.location.origin}/product/${id}`}
        />
      </Helmet>
      <div className="flex">
        <BreadcrumbCustom />
      </div>
      <div className="flex flex-col">
        <div className="mt-6 flex h-full w-full max-w-7xl flex-col items-start gap-4 md:grid md:grid-cols-[1fr_1fr]">
          <div className="h-full w-full overflow-hidden">
            <ProductGallery images={images} />
          </div>
          <div className="mt-6 h-full w-full md:mt-0">
            <div className="flex flex-col items-start gap-4">
              <h1 className="text-4xl leading-none font-semibold tracking-tight">
                {product.name}
              </h1>
              <p className="text-lg font-semibold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(product.price)}
              </p>
              <p>{product.description}</p>
            </div>

            {cartItem ? (
              <div className="mt-10 flex flex-col md:mt-20">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <span className="">Adicionar ou remover:</span>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDecrement}
                      >
                        <Minus />
                      </Button>
                      <span className="font-semibold">{cartItem.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleIncrement}
                        disabled={(product.stock || 0) <= cartItem.quantity}
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>
                  {quantityInCart > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="">Quantidade no carrinho:</span>
                      <span className="font-semibold">
                        {quantityInCart} unidade(s)
                      </span>
                    </div>
                  )}
                  <Button
                    className="mt-2 w-fit gap-2"
                    onClick={handleAddToCart}
                    disabled={(product.stock || 0) <= cartItem.quantity}
                  >
                    <ShoppingCart />
                    Adicionar mais ao carrinho
                  </Button>
                </div>
              </div>
            ) : (
              // Se não está no carrinho, mostrar botão de adicionar com quantidade
              <div className="mt-10 flex h-full flex-col gap-2 md:mt-20">
                <div className="flex items-center">
                  <span>Quantidade:</span>
                  <div className="flex items-center">
                    <Button
                      className="items-center"
                      variant="ghost"
                      size="icon"
                      onClick={handleDecrement}
                      disabled={localQuantity <= 1}
                    >
                      <Minus />
                    </Button>
                    <span>{localQuantity}</span>
                    <Button
                      className="items-center"
                      variant="ghost"
                      size="icon"
                      onClick={handleIncrement}
                      disabled={(product.stock || 0) <= localQuantity}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  Estoque: <span>{product.stock || 0} unidade(s) </span>
                </div>
                <Button
                  className="mt-2 w-fit gap-2"
                  onClick={
                    localQuantity === 1 ? handleAddToCart : handleAddMultiple
                  }
                  disabled={(product.stock || 0) === 0}
                >
                  <ShoppingCart />
                  {(product.stock || 0) === 0
                    ? "Fora de Estoque"
                    : localQuantity === 1
                      ? "Adicionar ao carrinho"
                      : `Adicionar ${localQuantity} ao carrinho`}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
