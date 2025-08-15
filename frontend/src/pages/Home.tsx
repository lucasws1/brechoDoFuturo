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
      <div className="mx-auto max-w-7xl px-6 py-8">
        <BreadcrumbCustom />

        <div className="mt-14 space-y-12">
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

  // const {
  //   products,
  //   pagination,
  //   loading,
  //   error,
  //   refetch,
  //   searchTerm,
  //   setSearchTerm,
  //   setCurrentPage,
  // } = useProductsContext();

  // const [searchParams] = useSearchParams();
  // const searchQuery = searchParams.get("search");
  // const isHome = !!useMatch({ path: "/", end: true });
  // const isSearchMode = !!searchQuery;

  // // Sincronizar termo de busca da URL com o contexto
  // useEffect(() => {
  //   if (searchQuery && searchQuery !== searchTerm) {
  //     setSearchTerm(searchQuery);
  //   } else if (!searchQuery && searchTerm) {
  //     setSearchTerm("");
  //   }
  // }, [searchQuery, searchTerm, setSearchTerm]);

  // if (error) {
  //   return (
  //     <div className="mx-auto max-w-7xl px-4 py-2">
  //       <div className="flex flex-col items-center gap-4 py-8 text-center">
  //         <h2 className="text-2xl font-bold text-red-600">
  //           Erro ao carregar produtos
  //         </h2>
  //         <p className="text-muted-foreground">{error}</p>
  //         <Button onClick={refetch} variant="outline">
  //           Tentar novamente
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  // return (
  //   <>
  //     <div className="mx-auto max-w-7xl px-6 py-8">
  //       <BreadcrumbCustom />
  //       {/* Loading */}
  //       {loading && (
  //         <div className="absolute inset-0 z-60 flex items-center justify-center bg-black/20">
  //           <SpinnerGapIcon
  //             color="black"
  //             size={48}
  //             className="animate-spin text-white"
  //           />
  //         </div>
  //       )}

  //       {/* Resultados da Busca ou Seções da Home */}
  //       {!loading && (
  //         <div className="mt-14 space-y-12">
  //           {isSearchMode ? (
  //             <>
  //               {/* Título da busca */}
  //               <div className="text-center">
  //                 <h2 className="text-2xl font-bold text-gray-900">
  //                   Resultados para "{searchQuery}"
  //                 </h2>
  //                 <p className="mt-2 text-gray-600">
  //                   {products.length > 0
  //                     ? `${pagination?.total || products.length} produto${(pagination?.total || products.length) !== 1 ? "s" : ""} encontrado${(pagination?.total || products.length) !== 1 ? "s" : ""}`
  //                     : "Nenhum produto encontrado"}
  //                 </p>
  //               </div>

  //               {/* Grid de produtos da busca */}
  //               {products.length > 0 ? (
  //                 <>
  //                   <ProductsGrid products={products} />

  //                   {/* Paginação */}
  //                   {pagination && pagination.totalPages > 1 && (
  //                     <div className="mt-8">
  //                       <ProductPagination
  //                         currentPage={pagination.page}
  //                         totalPages={pagination.totalPages}
  //                         onPageChange={setCurrentPage}
  //                       />
  //                     </div>
  //                   )}
  //                 </>
  //               ) : (
  //                 <div className="py-12 text-center">
  //                   <p className="text-gray-500">
  //                     Tente buscar com termos diferentes ou navegue pelas
  //                     categorias.
  //                   </p>
  //                 </div>
  //               )}
  //             </>
  //           ) : isHome ? (
  //             <>
  //               <CarouselDoFuturo />

  //               <NovidadesSection />
  //               <MaisVendidosSection />
  //               <OfertaEspecial />
  //               <DestaquesSection />
  //             </>
  //           ) : null}
  //         </div>
  //       )}
  //     </div>
  //   </>
  // );
};

export default Home;
