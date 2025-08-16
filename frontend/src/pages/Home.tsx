import BreadcrumbCustom from "@/components/BreadcrumbCustom";
import { CarouselDoFuturo } from "@/components/CarouselDoFuturo";
import DestaquesSection from "@/components/DestaquesSection";
import MaisVendidosSection from "@/components/MaisVendidosSection";
import NovidadesSection from "@/components/NovidadesSection";
import OfertaEspecial from "@/components/OfertaEspecial";
import { useMatch } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const isHome = !!useMatch({ path: "/", end: true });
  return (
    <>
      <Helmet>
        <title>Brechó do Futuro - Moda Sustentável e Acessível</title>
        <meta
          name="description"
          content="Descubra peças únicas no Brechó do Futuro. Qualidade com preços acessíveis."
        />
        <meta
          name="keywords"
          content="brechó, moda sustentável, roupas usadas, segunda mão, moda acessível"
        />
        <link rel="canonical" href={window.location.origin} />
      </Helmet>
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
