import ProductsGrid from "./ProductsGrid";
import { useProductsFetch } from "@/hooks/useProductFetch";

export default function DestaquesSection() {
  const { products, loading, error } = useProductsFetch({
    category: "destaques",
    sort: "newest",
    limit: 5,
  });

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar produtos: {error}</div>;

  return (
    <ProductsGrid products={products} title="Destaques" aplicarLimite={true} />
  );
}
