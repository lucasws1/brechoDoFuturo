import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { useProductsSearchParams } from "@/hooks/useProductsSearchParams";
import ProductsGrid from "@/components/ProductsGrid";
import SubCategoryChips from "@/components/SubCategoryChips";
import SortSelect from "@/components/SortSelect";
import PaginationInformation from "@/components/PaginationInformation";

const SearchPage = () => {
  const { search, setPage, sort, setSortValue } = useProductsSearchParams();
  const { products, pagination } = useCategoryProducts();

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Pesquisa</h1>
        <p className="text-sm">
          Resultados para: <span className="font-bold">{search}</span>
        </p>
        <SubCategoryChips />
        <SortSelect sort={sort} setSort={setSortValue} />
      </div>
      <div className="mt-10">
        <ProductsGrid products={products} />
      </div>

      <div className="mt-10 flex flex-col items-center justify-center">
        <PaginationInformation
          pagination={pagination}
          products={products}
          setPage={setPage}
        />
      </div>
    </section>
  );
};

export default SearchPage;
