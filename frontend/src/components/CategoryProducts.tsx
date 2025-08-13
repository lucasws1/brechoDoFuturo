import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { ProductPagination } from "@/components/ProductPagination";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { SpinnerGapIcon } from "@phosphor-icons/react";

export default function CategoryProducts() {
  const { products, pagination, loading, error, refetch } =
    useCategoryProducts();

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">
          Erro ao carregar produtos
        </h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={refetch} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <SpinnerGapIcon color="black" size={48} className="animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <h3 className="text-xl font-semibold">Nenhum produto encontrado</h3>
        <p className="text-muted-foreground">
          Não há produtos disponíveis nesta categoria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid de produtos com todos os produtos (não limitado por breakpoint) */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Informações de paginação */}
      {pagination && (
        <div className="text-muted-foreground text-center text-sm">
          Mostrando {products.length} de {pagination.total} produtos
          {pagination.totalPages > 1 && (
            <span>
              {" "}
              • Página {pagination.page} de {pagination.totalPages}
            </span>
          )}
        </div>
      )}

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8">
          <ProductPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={() => {}}
          />
        </div>
      )}
    </div>
  );
}
