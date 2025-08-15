import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useProductsSearchParams } from "@/hooks/useProductsSearchParams";

import { Gift } from "lucide-react";

const BreadcrumbCustom = () => {
  const { slug, sub, isSearchPage } = useProductsSearchParams();

  const slugToName = (name: string) => {
    if (name === "maisvendidos") return "Mais vendidos";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <>
      {!slug && !isSearchPage ? (
        <div className="mt-6 flex w-full items-center justify-center gap-3">
          <Gift size={28} />
          <span className="flex items-center text-2xl text-black">
            um presente do passado
          </span>
        </div>
      ) : (
        <div>
          <Breadcrumb className="flex items-center justify-start text-base">
            <BreadcrumbList className="flex items-center">
              <>
                <BreadcrumbItem className="flex items-center">
                  <BreadcrumbLink href="/">Explorar</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="translate-y-[1.5px]" />

                {!sub ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {isSearchPage ? "Pesquisar" : slugToName(slug)}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={`/category/${slug}`}>
                        <span>{slugToName(slug)}</span>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="translate-y-[-2px]" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{slugToName(sub)}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}
    </>
  );
};

export default BreadcrumbCustom;
