import BreadcrumbCustom from "@/components/BreadcrumbCustom";
import { CarouselDoFuturo } from "@/components/CarouselDoFuturo";
import MaisVendidos from "@/components/MaisVendidos";
import NewProductsSection from "@/components/NewProductsSection";
import OfertaEspecial from "@/components/OfertaEspecial";
import { ProductPagination } from "@/components/ProductPagination";
import { Button } from "@/components/ui/button";
import { useProductsContext } from "@/contexts/ProductsContext";
import { SpinnerGapIcon } from "@phosphor-icons/react";

const Home = () => {
  const { products, pagination, loading, error, setCurrentPage, refetch } =
    useProductsContext();

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
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-2">
        <BreadcrumbCustom />
      </div>
      <div className="mx-auto mt-8 max-w-7xl space-y-8 px-4">
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
        <CarouselDoFuturo />

        {/* Grade de Produtos */}
        {!loading && products.length > 0 && (
          <div className="mt-12">
            <NewProductsSection />
            <OfertaEspecial />
            <MaisVendidos />
            {/* <div className="mt-12 grid w-full grid-cols-1 gap-8 space-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div> */}

            {/* Botão "Ver mais" - só aparece se há mais páginas */}
            {pagination &&
              pagination.page < pagination.totalPages &&
              pagination.page === 1 && (
                <div className="mt-8 flex justify-center">
                  <Button
                    className="w-full max-w-xs"
                    onClick={() => setCurrentPage(pagination.page + 1)}
                  >
                    Ver mais...
                  </Button>
                </div>
              )}

            {/* Paginação */}
            {pagination &&
              pagination.page !== 1 &&
              pagination.totalPages > 1 && (
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
        {pagination && (
          <div className="text-muted-foreground mt-4 text-center text-sm">
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
