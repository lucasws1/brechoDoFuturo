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
  title,
}: {
  products: Product[];
  title: string;
}) => {
  const bp = useBreakpoint();
  const limit = bp === "xl" ? 5 : bp === "lg" ? 4 : bp === "md" ? 3 : 2;

  return (
    <div className="flex max-w-[1160px] flex-col lg:max-w-[1240px] xl:max-w-[1320px]">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h1>
      <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.slice(0, limit).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
