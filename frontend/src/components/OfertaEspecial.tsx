import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useProductsFetch } from "@/hooks/useProductFetch";

export default function OfertaEspecial() {
  const { products, loading, error } = useProductsFetch({
    category: "ofertas",
    sort: "newest",
    limit: 5,
  });

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar produtos: {error}</div>;

  return (
    <section className="rounded-2xl bg-neutral-300 p-6 md:p-8">
      <div className="grid items-center gap-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="text-sm text-neutral-600">Oferta Especial</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {products[0]?.name || "Produto"}
          </h3>
          <p className="mt-3 text-neutral-700">
            {products[0]?.description || "Descrição"}
          </p>
          <Link to={`/product/${products[0]?.id}`}>
            <Button className="mt-5 cursor-pointer rounded-lg bg-neutral-900 px-4 py-2 text-white">
              Ver produto
            </Button>
          </Link>
        </div>

        <div className="md:col-span-7">
          <div className="aspect-[16/9] max-h-[360px] overflow-hidden rounded-xl md:aspect-[21/9] md:max-h-[420px]">
            <img
              src={products[0]?.images?.[0]}
              className="h-full w-full object-cover"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}
