import type { Product } from "@/types/Product";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl =
    product.images?.[0] ||
    product.image ||
    "https://placehold.co/300x300/e0e0e0/ffffff?text=Sem+Imagem";

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <Link to={`/product/${product.id}`}>
      <div className="max-w-[240px] overflow-hidden -tracking-[0.015em] hover:opacity-80">
        <div className="relative overflow-hidden rounded-[8px]">
          <img
            src={imageUrl}
            alt={product.name}
            className="aspect-square h-auto w-full object-cover"
          />
        </div>
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-[700] text-[#61005d]">
              {formattedPrice}
            </span>

            {/* Categoria */}
            {product.categories && product.categories.length > 0 && (
              <span className="text-primary bg-primary/5 rounded-md px-2 py-1 text-xs font-[600]">
                {product.categories[0]?.name}
              </span>
            )}
          </div>
          <h3 className="truncate text-sm font-[500] text-black">
            {product.name}
          </h3>
          <p className="truncate text-xs font-[400] text-zinc-800">
            {product.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
