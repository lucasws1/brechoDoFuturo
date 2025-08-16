import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { useCategorySearchParams } from "@/hooks/useCategorySearchParams";
import SortSelect from "@/components/SortSelect";
import PaginationInformation from "@/components/PaginationInformation";
import BreadcrumbCustom from "@/components/BreadcrumbCustom";
import { ProductCard } from "@/components/ProductCard";
import { Helmet } from "react-helmet-async";

const SearchPage = () => {
  const { search, setPage, sort, setSortValue } = useCategorySearchParams();
  const { products, pagination } = useCategoryProducts();

  return (
    <section className="mx-auto max-w-7xl px-6 py-0">
      <Helmet>
        <title>{`Busca: "${search}" | Brechó do Futuro`}</title>
        <meta
          name="description"
          content={`Resultados da busca por "${search}" no Brechó do Futuro. Encontre produtos únicos e acessíveis.`}
        />
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="canonical"
          href={`${window.location.origin}/search?search=${encodeURIComponent(search)}`}
        />
      </Helmet>
      <BreadcrumbCustom />
      <div className="mt-6 text-4xl leading-none font-semibold tracking-tight">
        Resultados para <span className="text-3xl font-bold">"{search}"</span>
      </div>
      <div className="mt-4 flex w-full justify-end">
        <SortSelect sort={sort} setSort={setSortValue} />
      </div>
      <div className="mt-4 space-y-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

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
