import { useProductsContext } from "@/contexts/ProductsContext";
import type { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const placeholder = "https://placehold.co/600x800";

const OfertaEspecial = () => {
  const { fetchProductsByCategory } = useProductsContext();
  const [ofertaEspecial, setOfertaEspecial] = useState<Product>();

  useEffect(() => {
    const randomProduct = Math.floor(Math.random() * 4) + 1;
    const fetchData = async (
      categoryName: string,
      limit: number,
      sort: string,
    ) => {
      const items = await fetchProductsByCategory(categoryName, limit, sort);
      setOfertaEspecial(items[randomProduct]);
    };
    fetchData("Ofertas", 5, "");
  }, []);

  if (!ofertaEspecial) {
    return (
      <section className="mt-8">
        <div className="rounded-2xl bg-neutral-100 p-4 md:p-6">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="h-4 w-24 rounded-full bg-neutral-200" />
              <div className="h-8 w-2/3 rounded-lg bg-neutral-200" />
              <div className="h-3 w-full rounded-md bg-neutral-200" />
              <div className="h-3 w-3/4 rounded-md bg-neutral-200" />
              <div className="h-9 w-32 rounded-lg bg-neutral-300" />
            </div>
            <div className="h-[280px] w-full overflow-hidden rounded-xl bg-neutral-200 md:h-[320px]" />
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="rounded-2xl bg-neutral-200 p-6 md:p-8">
      <div className="grid items-center gap-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="text-sm text-neutral-500">Oferta Especial</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {ofertaEspecial.name}
          </h3>
          <p className="mt-3 text-neutral-700">{ofertaEspecial.description}</p>
          <Link to={`/product/${ofertaEspecial.id}`}>
            <Button className="mt-5 cursor-pointer rounded-lg bg-neutral-900 px-4 py-2 text-white">
              Ver produto
            </Button>
          </Link>
        </div>

        <div className="md:col-span-7">
          <div className="aspect-[16/9] max-h-[360px] overflow-hidden rounded-xl md:aspect-[21/9] md:max-h-[420px]">
            <img
              src={ofertaEspecial.images?.[0] || placeholder}
              className="h-full w-full object-cover"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfertaEspecial;
