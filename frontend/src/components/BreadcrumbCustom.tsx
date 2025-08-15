import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCategory } from "@/hooks/useCategory";
import { useLocation, useSearchParams } from "react-router-dom";

const BreadcrumbCustom = () => {
  const location = useLocation();
  const getCurrentSlug = () => {
    const match = location.pathname.match(/^\/category\/([^/?]+)/);
    return match ? match[1] : "Explorar";
  };

  const [searchParams] = useSearchParams();
  const currentSlug = getCurrentSlug();

  const sub = searchParams.get("sub");
  const { hierarchy, loading } = useCategory(sub ? sub : currentSlug);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
      </div>
    );
  }

  return (
    <>
      <div>
        <Breadcrumb className="flex items-end justify-start text-base">
          <BreadcrumbList className="flex items-end">
            <BreadcrumbItem className="flex items-end">
              {currentSlug === "Explorar" ? (
                <BreadcrumbPage>Explorar</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href="/">Explorar</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {hierarchy.length > 0 && (
              <>
                {hierarchy.map((category, index) => (
                  <div key={category.name} className="flex items-end gap-2">
                    <BreadcrumbSeparator className="translate-y-[-2px]" />
                    <BreadcrumbItem>
                      {index === hierarchy.length - 1 ? (
                        <BreadcrumbPage>
                          <span>{category.name}</span>
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={`/category/${currentSlug}`}
                          className="cursor-pointer"
                        >
                          {category.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </>
  );
};

export default BreadcrumbCustom;
