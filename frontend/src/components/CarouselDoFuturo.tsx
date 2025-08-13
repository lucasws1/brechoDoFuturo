import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carouselCustom";
import banners from "@/data/banners";
import { useEffect, useState } from "react";

export function CarouselDoFuturo() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative">
      <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={index}>
              <div className="relative h-72 w-full overflow-hidden rounded-2xl object-cover lg:h-96">
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex bg-gradient-to-b from-white/50 via-transparent">
                  <span className="mt-2 ml-2 text-sm tracking-wide">
                    brechó do futuro
                  </span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="top-1/2 left-2 cursor-pointer bg-white/20 text-black/80 shadow-none hover:bg-white/80 hover:text-black/100" />
        <CarouselNext className="top-1/2 right-2 cursor-pointer bg-white/20 text-black/80 shadow-none hover:bg-white/80 hover:text-black/100" />
      </Carousel>

      {/* Pontinhos de paginação */}
      <div className="-mt-4 flex justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`z-50 h-[6px] w-[6px] cursor-pointer rounded-full bg-white/50 transition-all ${
              current === index + 1
                ? "bg-white/100"
                : "bg-none hover:bg-white/100"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
