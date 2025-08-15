import type { Product } from "@/types/Product";
import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";

function useBreakpoint() {
  const [bp, setBp] = useState<"base" | "md" | "lg" | "xl">("base");

  useEffect(() => {
    const handleResize = () => {
      setBp(
        window.innerWidth < 768
          ? "base"
          : window.innerWidth < 1024
            ? "md"
            : window.innerWidth < 1280
              ? "lg"
              : "xl",
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return bp;
}

const ProductsGrid = ({
  products,
  title = "",
  aplicarLimite = false,
}: {
  products: Product[];
  title?: string;
  aplicarLimite?: boolean;
}) => {
  const bp = useBreakpoint();
  const limit = bp === "xl" ? 5 : bp === "lg" ? 4 : bp === "md" ? 3 : 2;

  return (
    <div className="flex max-w-7xl flex-col gap-4">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <div
        className={`grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 ${
          aplicarLimite ? "xl:grid-cols-5" : ""
        }`}
      >
        {aplicarLimite
          ? products
              .slice(0, limit)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
