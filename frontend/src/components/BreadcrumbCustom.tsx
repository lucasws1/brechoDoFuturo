import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCategory } from "@/hooks/useCategory";
import { useCategorySearchParams } from "@/hooks/useCategorySearchParams";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useProductById } from "@/hooks/useProductById";
import type { Category } from "@/types/Category";
import { HouseIcon } from "@phosphor-icons/react";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useMatch } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
          <Breadcrumb className="flex w-full justify-start">
            <BreadcrumbList className="flex w-full">
              <div className="flex w-full">
                <BreadcrumbItem className="flex items-start">
                  <BreadcrumbLink href="/">
                    <HouseIcon size={20} />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="mx-2 translate-y-1" />

                {!sub ? (
                  <>
                    {isProductPage ? (
                      <>
                        {parentCategory && (
                          <>
                            {!isMobile && (
                              <>
                                <BreadcrumbItem>
                                  <BreadcrumbLink
                                    href={`/category/${parentCategory.slug}`}
                                  >
                                    {parentCategory?.name}
                                  </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="mx-2 translate-y-1" />
                              </>
                            )}
                          </>
                        )}
                        <BreadcrumbItem>
                          <BreadcrumbLink
                            className="max-w-[50px] truncate sm:max-w-[100px]"
                            href={
                              parentCategory
                                ? `/category/${parentCategory.slug}?sub=${product?.category?.slug}`
                                : `/category/${product?.category?.slug}`
                            }
                          >
                            {isMobile ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-2">
                                  <BreadcrumbEllipsis className="-translate-y-1" />
                                  <ChevronDown
                                    size={16}
                                    color="black"
                                    className="-translate-y-1"
                                  />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[100px] rounded-xl">
                                  <DropdownMenuLabel className="text-muted-foreground text-sm">
                                    Categorias
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem className="ml-2 flex cursor-pointer items-center justify-start">
                                    <Link
                                      to={`/category/${product?.category?.parent?.slug}`}
                                    >
                                      {product?.category?.parent?.name}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="ml-2 flex cursor-pointer items-center justify-start">
                                    <Link
                                      to={`/category/${product?.category?.parent?.slug}?sub=${product?.category?.slug}`}
                                    >
                                      {product?.category?.name}
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              product?.category?.name
                            )}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="mx-2 translate-y-1" />
                        <BreadcrumbItem className="items-start">
                          <BreadcrumbPage className="max-w-[10rem] truncate md:max-w-full">
                            {product?.name}
                          </BreadcrumbPage>
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
