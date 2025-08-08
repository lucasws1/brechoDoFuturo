import type { Product } from "@/types/Product";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] || "https://placehold.co/300x300";

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <Link to={`/product/${product.id}`}>
      <div className="h-full w-full overflow-hidden hover:opacity-80">
        <div className="mb-2 flex aspect-square h-[280px] w-auto flex-col overflow-hidden rounded-xl">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-auto object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="truncate text-sm leading-tight font-medium text-black">
              {product.name}
            </h3>
          </div>
          <span className="text-muted-foreground text-xs leading-tight">
            {formattedPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}
