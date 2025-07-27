import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const banners = [
  {
    id: 1,
    image: "/carrossel2.png",
    alt: "Banner do Brechó",
  },
  {
    id: 2,
    image: "/carrossel1.png",
    alt: "Banner do Brechó",
  },
];

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
              <div className="h-48 w-full overflow-hidden rounded-md object-cover">
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="top-1/2 left-2 cursor-pointer bg-white/50 text-black hover:bg-purple-600/50" />
        <CarouselNext className="top-1/2 right-2 cursor-pointer bg-white/50 text-black hover:bg-purple-600/50" />
      </Carousel>

      {/* Pontinhos de paginação */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-2 cursor-pointer rounded-full transition-all ${
              current === index + 1
                ? "scale-125 bg-neutral-500"
                : "bg-neutral-500/50 hover:bg-neutral-500/75"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
