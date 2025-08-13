import BreadcrumbCustom from "@/components/BreadcrumbCustom";
import SortSelect from "@/components/SortSelect";
import SubCategoryChips from "@/components/SubCategoryChips";
import { useProductsSearchParams } from "@/hooks/useProductsSearchParams";
import { Helmet } from "react-helmet-async";
import { ProductPagination } from "@/components/ProductPagination";
import { Button } from "@/components/ui/button";
import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { SpinnerGapIcon } from "@phosphor-icons/react";
import { ProductCard } from "@/components/ProductCard";
import PaginationInformation from "@/components/PaginationInformation";

const CategoryPage: React.FC = () => {
  const { slug, setSortValue, sort, setPage, page } = useProductsSearchParams();
  const { products, pagination, loading, error, refetch } =
    useCategoryProducts();

  if (!slug) return <div>Categoria não encontrada</div>;

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
    <section className="mx-auto max-w-7xl px-6 py-8">
      <Helmet>
        <title>{`${
          slug.charAt(0).toUpperCase() + slug.slice(1)
        } | Brechó do Futuro`}</title>
        <meta name="description" content={`Produtos da categoria ${slug}.`} />
        <link rel="canonical" href={`${location.origin}/category/${slug}`} />
      </Helmet>
      <div className="flex">
        <BreadcrumbCustom />
      </div>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex w-full justify-end gap-4">
          <SubCategoryChips />
          <SortSelect sort={sort} setSort={setSortValue} />
        </div>
      </header>

      <div className="space-y-8">
        {/* Grid de produtos com todos os produtos (não limitado por breakpoint) */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <PaginationInformation
          pagination={pagination}
          page={page}
          products={products}
        />

        {/* Informações de paginação */}
        {/* {pagination && (
          <div className="text-muted-foreground text-center text-sm">
            Mostrando {products.length} de {pagination.total} produtos
            {pagination.totalPages > 1 && (
              <span>
                {" "}
                • Página {pagination.page} de {pagination.totalPages}
              </span>
            )}
          </div>
        )} */}

        {/* Paginação */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <ProductPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage || (() => {})}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryPage;
