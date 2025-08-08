import { useProductsContext } from "@/contexts/ProductsContext";
import type { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const placeholder = "https://placehold.co/600x800";

const OfertaEspecial = () => {
  const { fetchOfertaEspecial } = useProductsContext();
  const [ofertaEspecial, setOfertaEspecial] = useState<Product>();
  console.log(ofertaEspecial);

  useEffect(() => {
    const randomProduct = Math.floor(Math.random() * 4) + 1;
    const fetchData = async () => {
      const items = await fetchOfertaEspecial();
      setOfertaEspecial(items[randomProduct]);
    };
    fetchData();
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
    <section className="mt-8">
      <div className="rounded-2xl bg-neutral-200 px-12 py-6">
        <div className="grid items-center gap-2 md:grid-cols-2">
          {/* Texto */}
          <div className="order-2 space-y-2 md:order-1 md:pr-6">
            <p className="text-muted-foreground text-sm font-normal">
              Oferta Especial
            </p>
            <h2 className="text-xl font-bold tracking-tight text-black md:text-2xl">
              {ofertaEspecial.name}
            </h2>
            <p className="text-muted-foreground text-md max-w-md leading-relaxed">
              Elegância e qualidade com preço baixo.
            </p>
            <div className="pt-2">
              <Button asChild>
                <Link to={`/product/${ofertaEspecial.id}`}>Ver produto</Link>
              </Button>
            </div>
          </div>

          {/* Imagem */}
          <div className="order-1 md:order-2">
            <Link to={`/product/${ofertaEspecial.id}`}>
              <div className="h-[280px] w-auto overflow-hidden rounded-xl">
                <img
                  src={ofertaEspecial.images?.[0] || placeholder}
                  alt={ofertaEspecial.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfertaEspecial;
