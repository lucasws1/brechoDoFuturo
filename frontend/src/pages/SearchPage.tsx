import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { useProductsSearchParams } from "@/hooks/useProductsSearchParams";
import ProductsGrid from "@/components/ProductsGrid";
import { ProductPagination } from "@/components/ProductPagination";

const SearchPage = () => {
  const { search, sub, page } = useProductsSearchParams();
  const { products, pagination, loading, error } = useCategoryProducts();

  return (
    <div>
      <h1>SearchPage</h1>
      <p>Search: {search}</p>
      <p>Sub: {sub}</p>
      <ProductsGrid products={products} />
      <ProductPagination
        currentPage={page}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={() => {}}
      />
      {error && <p>Error: {error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default SearchPage;
