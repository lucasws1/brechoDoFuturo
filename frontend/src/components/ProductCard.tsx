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
      <div className="group h-full w-full overflow-hidden transition hover:opacity-80">
        <div className="relative w-full overflow-hidden rounded-xl">
          <div className="aspect-square md:aspect-[4/5]">
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-auto object-cover"
            />
          </div>
          {product.category && (
            <span className="absolute top-1 right-1 rounded bg-black/30 px-1 py-0.5 text-[10px] font-medium text-white">
              {product.category.name}
            </span>
          )}
        </div>
        <div className="mt-1 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium tracking-tight md:text-[15px]">
              {product.name}
            </h3>
          </div>
          <span className="text-[13px] font-medium tracking-normal md:text-sm">
            {formattedPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}
