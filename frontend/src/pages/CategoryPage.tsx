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
import { useCategory } from "@/hooks/useCategory";
import { useEffect, useState } from "react";
import type { Category } from "@/types/Category";

const CategoryPage: React.FC = () => {
  const { slug, setSortValue, sort, setPage, sub } = useProductsSearchParams();
  const [cat, setCat] = useState<Category | null>(null);
  const { products, pagination, loading, error, refetch } =
    useCategoryProducts();

  const { fetchCategoryBySlug, loading: loadingCategory } = useCategory();

  useEffect(() => {
    const fetchCategory = async () => {
      const catBySlug = await fetchCategoryBySlug(slug);
      setCat(catBySlug as Category);
    };
    fetchCategory();
  }, [slug]);

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

  if (loading || loadingCategory) {
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
    <section className="mx-auto max-w-7xl px-6 py-0">
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
      <div className="mt-6 text-4xl leading-none font-semibold tracking-tight">
        {cat?.name}
      </div>
      <header className="mt-4 flex w-full">
        <div className="flex w-full justify-between gap-4">
          {cat?.subcategories && cat?.subcategories.length > 0 ? (
            <div>
              <SubCategoryChips
                parentSlug={slug}
                children={cat?.subcategories ?? []}
                activeChildSlug={sub}
                showAllChip={true}
              />
            </div>
          ) : (
            <div></div>
          )}
          <div className="w-fit">
            <SortSelect sort={sort} setSort={setSortValue} />
          </div>
        </div>
      </header>

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
