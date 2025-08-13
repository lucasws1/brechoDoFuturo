import { useProductsFetch } from "@/hooks/useProductFetch";
import ProductsGrid from "./ProductsGrid";

export default function NovidadesSection() {
  const { products, loading, error } = useProductsFetch({
    category: "novidades",
    sort: "newest",
    limit: 5,
  });

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar produtos: {error}</div>;

  return (
    <ProductsGrid products={products} title="Novidades" aplicarLimite={true} />
  );
}
