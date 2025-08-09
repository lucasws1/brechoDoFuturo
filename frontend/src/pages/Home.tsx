import BreadcrumbCustom from "@/components/BreadcrumbCustom";
import { CarouselDoFuturo } from "@/components/CarouselDoFuturo";
import CategoriaProducts from "@/components/CategoriaProducts";
import DestaquesSection from "@/components/DestaquesSection";
import MaisVendidosSection from "@/components/MaisVendidosSection";
import NovidadesSection from "@/components/NovidadesSection";
import OfertaEspecial from "@/components/OfertaEspecial";
import { ProductPagination } from "@/components/ProductPagination";
import { Button } from "@/components/ui/button";
import { useProductsContext } from "@/contexts/ProductsContext";
import { SpinnerGapIcon } from "@phosphor-icons/react";

const Home = () => {
  const { products, pagination, loading, error, setCurrentPage, refetch } =
    useProductsContext();
  const { selectedCategory } = useProductsContext();

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Erro ao carregar produtos
          </h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={refetch} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto mt-6 max-w-7xl px-6">
        <BreadcrumbCustom />
        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 z-60 flex items-center justify-center bg-black/20">
            <SpinnerGapIcon
              color="black"
              size={48}
              className="animate-spin text-white"
            />
          </div>
        )}
        <div className="mt-6">
          <CarouselDoFuturo />
        </div>

        {/* Grade de Produtos */}
        {!loading && products.length > 0 && (
          <div className="mt-14 space-y-12">
            {!selectedCategory ? (
              <>
                <NovidadesSection />
                <MaisVendidosSection />
                <OfertaEspecial />
                <DestaquesSection />
              </>
            ) : (
              <CategoriaProducts category={selectedCategory} />
            )}

            {/* Paginação */}
            {selectedCategory && pagination && pagination.totalPages > 1 && (
              <div className="mt-12">
                <ProductPagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}

        {/* Estado vazio */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <h3 className="text-xl font-semibold">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground">
              Não há produtos disponíveis no momento
            </p>
          </div>
        )}

        {/* Informações de paginação */}
        {selectedCategory && pagination && (
          <div className="text-muted-foreground mt-12 text-center text-sm">
            Mostrando {products.length} de {pagination.total} produtos
            {pagination.totalPages > 1 && (
              <span>
                {" "}
                • Página {pagination.page} de {pagination.totalPages}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
