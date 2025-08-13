import ProductsGrid from "./ProductsGrid";
import { useProductsFetch } from "@/hooks/useProductFetch";

export default function MaisVendidosSection() {
  const { products, loading, error } = useProductsFetch({
    category: "maisvendidos",
    sort: "newest",
    limit: 5,
  });

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar produtos: {error}</div>;

  return (
    <ProductsGrid
      products={products}
      title="Mais vendidos"
      aplicarLimite={true}
    />
  );
}
