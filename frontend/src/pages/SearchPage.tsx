import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { useProductsSearchParams } from "@/hooks/useProductsSearchParams";
import ProductsGrid from "@/components/ProductsGrid";
import { ProductPagination } from "@/components/ProductPagination";
import SubCategoryChips from "@/components/SubCategoryChips";
import SortSelect from "@/components/SortSelect";
import PaginationInformation from "@/components/PaginationInformation";

const SearchPage = () => {
  const { search, sub, page, setPage, sort, setSortValue } =
    useProductsSearchParams();
  const { products, pagination, loading, error } = useCategoryProducts();

  return (
    <div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Pesquisa</h1>
        <p className="text-sm text-neutral-600">Resultados para: {search}</p>
        <SubCategoryChips />
        <SortSelect sort={sort} setSort={setSortValue} />
      </div>
      <div className="mt-10">
        <ProductsGrid products={products} />
      </div>

      <div className="mt-10 flex flex-col items-center justify-center">
        <PaginationInformation
          pagination={pagination}
          page={page}
          products={products}
        />
        {/* {pagination && (
          <div className="text-muted-foreground text-center text-sm">
            Mostrando{" "}
            {pagination.totalPages > 1
              ? page * products.length
              : products.length}{" "}
            de {pagination.total} produtos
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
          <div className="mt-2">
            <ProductPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage || (() => {})}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
