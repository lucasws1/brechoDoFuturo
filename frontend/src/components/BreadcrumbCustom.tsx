import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useProductsContext } from "@/contexts/ProductsContext";
import { useCategoryHierarchy } from "@/hooks/useProductById";

const BreadcrumbCustom = () => {
  const { selectedCategory, setSelectedCategory } = useProductsContext();
  const { hierarchy, loading } = useCategoryHierarchy(selectedCategory || null);

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
              {hierarchy.length === 0 ? (
                <BreadcrumbPage className="leading-tight tracking-wide">
                  Explorar
                </BreadcrumbPage>
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
                          <span className="leading-tight font-medium tracking-wide">
                            {category.name}
                          </span>
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          onClick={() => setSelectedCategory(category.name)}
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
