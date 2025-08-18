import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { useCategorySearchParams } from "@/hooks/useCategorySearchParams";
import { useMatch } from "react-router-dom";
import { useProductById } from "@/hooks/useProductById";
import { useCategory } from "@/hooks/useCategory";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import type { Category } from "@/types/Category";

const BreadcrumbCustom = () => {
  const { slug, sub, isSearchPage, search } = useCategorySearchParams();
  const isProductPage = useMatch("/product/:id")?.params.id;
  const { product } = useProductById(isProductPage);
  const { fetchCategoryById } = useCategory();
  const isMobile = useIsMobile();
  const [parentCategory, setParentCategory] = useState<Category | null>(null);

  useEffect(() => {
    const getCategory = async () => {
      if (product?.category?.parentId) {
        const category = await fetchCategoryById(product?.category?.parentId);
        setParentCategory(category);
      }
    };
    getCategory();
  }, [product?.category]);

  const slugToName = (name: string) => {
    if (name === "maisvendidos") return "Mais vendidos";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <>
      {!slug && !isSearchPage && !isProductPage ? (
        <div className="mt-6 flex w-full items-center justify-center gap-3">
          <span className="flex items-center text-2xl text-black text-shadow-lg">
            brechó do futuro
          </span>
        </div>
      ) : (
        <>
          <Breadcrumb className="flex justify-start text-base">
            <BreadcrumbList className="flex">
              <div className="flex">
                <BreadcrumbItem className="flex">
                  <BreadcrumbLink href="/">Explorar</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="mx-2 translate-y-1" />

                {!sub ? (
                  <>
                    {isProductPage ? (
                      <>
                        {parentCategory && (
                          <>
                            {isMobile ? (
                              <BreadcrumbItem>
                                <BreadcrumbEllipsis />
                              </BreadcrumbItem>
                            ) : (
                              <BreadcrumbItem>
                                <BreadcrumbLink
                                  href={`/category/${parentCategory.slug}`}
                                >
                                  {parentCategory?.name}
                                </BreadcrumbLink>
                              </BreadcrumbItem>
                            )}
                            <BreadcrumbSeparator className="mx-2 translate-y-1" />
                          </>
                        )}
                        <BreadcrumbItem>
                          <BreadcrumbLink
                            href={
                              parentCategory
                                ? `/category/${parentCategory.slug}?sub=${product?.category?.slug}`
                                : `/category/${product?.category?.slug}`
                            }
                          >
                            {product?.category?.name}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="mx-2 translate-y-1" />
                        <BreadcrumbItem>
                          <BreadcrumbPage>{product?.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    ) : (
                      <>
                        {isSearchPage ? (
                          <>
                            <BreadcrumbItem>
                              <BreadcrumbLink href="#">
                                Pesquisar
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="mx-2 translate-y-1" />
                            <BreadcrumbItem>
                              <BreadcrumbPage>{search}</BreadcrumbPage>
                            </BreadcrumbItem>
                          </>
                        ) : (
                          <BreadcrumbPage>{slugToName(slug)}</BreadcrumbPage>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={`/category/${slug}`}>
                        <span>{slugToName(slug)}</span>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="mx-2 translate-y-1" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{slugToName(sub)}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </div>
            </BreadcrumbList>
          </Breadcrumb>
        </>
      )}
    </>
  );
};

export default BreadcrumbCustom;
