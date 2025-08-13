import ProductsGrid from "./ProductsGrid";
import type { CategoryProductsProps } from "./CategoryProducts";
import { useCategoryProducts } from "@/hooks/useCategoryProducts";

export default function MaisVendidosSection({
  categorySlug,
  sort = "newest",
  subcategory,
  page = 1,
  limit = 5,
}: CategoryProductsProps) {
  const { products } = useCategoryProducts({
    categorySlug,
    subcategory,
    sort,
    page,
    limit,
  });

  return <ProductsGrid products={products} title="Mais vendidos" />;
}
