import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carouselCustom";
import { useEffect, useState } from "react";

const banners = [
  {
    id: 1,
    image: "/carrossel3.png",
    alt: "Banner do Brechó",
  },
  {
    id: 2,
    image: "/carrossel2.png",
    alt: "Banner do Brechó",
  },
  {
    id: 3,
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
              <div className="h-48 w-full overflow-hidden rounded-xl object-cover">
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="top-1/2 left-2 cursor-pointer bg-white/60" />
        <CarouselNext className="top-1/2 right-2 cursor-pointer bg-white/60" />
      </Carousel>

      {/* Pontinhos de paginação */}
      <div className="mt-2 flex justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-2 cursor-pointer rounded-full border border-purple-900 transition-all ${
              current === index + 1
                ? "scale-125 bg-purple-800"
                : "bg-none hover:bg-purple-600"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
