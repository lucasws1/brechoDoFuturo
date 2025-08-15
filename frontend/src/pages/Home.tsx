import BreadcrumbCustom from "@/components/BreadcrumbCustom";
import { CarouselDoFuturo } from "@/components/CarouselDoFuturo";
import DestaquesSection from "@/components/DestaquesSection";
import MaisVendidosSection from "@/components/MaisVendidosSection";
import NovidadesSection from "@/components/NovidadesSection";
import OfertaEspecial from "@/components/OfertaEspecial";
import { useMatch } from "react-router-dom";

const Home = () => {
  const isHome = !!useMatch({ path: "/", end: true });
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-0">
        <BreadcrumbCustom />

        <div className="mt-10 space-y-12">
          {isHome ? (
            <>
              <CarouselDoFuturo />

              <NovidadesSection />
              <MaisVendidosSection />
              <OfertaEspecial />
              <DestaquesSection />
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Home;
