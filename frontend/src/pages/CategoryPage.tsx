import CategoryProducts from "@/components/CategoryProducts";
import BreadcrumbCustom from "@/components/BreadcrumbCustom";
import SortSelect from "@/components/SortSelect";
import SubCategoryChips from "@/components/SubCategoryChips";
import { useProductsSearchParams } from "@/hooks/useProductsSearchParams";
import { Helmet } from "react-helmet-async";

const CategoryPage: React.FC = () => {
  const { params, setPage, setSortValue } = useProductsSearchParams();

  if (!params.slug) return <div>Categoria não encontrada</div>;

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <Helmet>
        <title>{`${
          params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
        } | Brechó do Futuro`}</title>
        <meta
          name="description"
          content={`Produtos da categoria ${params.slug}.`}
        />
        <link
          rel="canonical"
          href={`${location.origin}/category/${params.slug}`}
        />
      </Helmet>
      <div className="flex">
        <BreadcrumbCustom />
      </div>

      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex w-full justify-end gap-4">
          <SubCategoryChips />
          <SortSelect sort={params.sort} setSort={setSortValue} />
        </div>
      </header>

      <CategoryProducts
        categorySlug={params.slug}
        sort={params.sort as "newest" | "oldest" | "price-asc" | "price-desc"}
        subcategory={params.subcategory || undefined}
        page={params.page}
        limit={params.limit}
        onPageChange={setPage}
      />
    </section>
  );
};

export default CategoryPage;
