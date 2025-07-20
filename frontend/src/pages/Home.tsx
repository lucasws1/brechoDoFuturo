import { ProductCard } from "@/components/ProductCard";
import { ProductPagination } from "@/components/ProductPagination";
import { Button } from "@/components/ui/button";
import { useProductsContext } from "@/contexts/ProductsContext";

const Home = () => {
  const {
    products,
    pagination,
    loading,
    error,
    currentPage,
    setCurrentPage,
    refetch,
  } = useProductsContext();

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-4">
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
    <div className="mx-auto max-w-7xl p-4">
      {/* Seção de Cabeçalho */}
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Nossa Coleção
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          Descubra peças únicas e cheias de estilo. Qualidade e curadoria que
          você só encontra aqui.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="text-lg">Carregando produtos...</div>
        </div>
      )}

      {/* Grade de Produtos */}
      {!loading && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Paginação */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-12">
              <ProductPagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {/* Botão "Ver mais" - só aparece se há mais páginas */}
          {pagination && pagination.page < pagination.totalPages && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                className="w-full max-w-xs"
                onClick={() => setCurrentPage(pagination.page + 1)}
              >
                Ver mais
              </Button>
            </div>
          )}
        </>
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
  );
};

export default Home;
