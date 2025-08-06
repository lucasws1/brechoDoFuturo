import { useProductsContext } from "@/contexts/ProductsContext";
import { useCategoryHierarchy } from "@/hooks/useProductById";
import { XIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {hierarchy.length > 0 && (
              <>
                {hierarchy.map((category, index) => (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {index === hierarchy.length - 1 ? (
                        <BreadcrumbPage>{category.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          onClick={() => setSelectedCategory(category.name)}
                          className="cursor-pointer"
                        >
                          {category.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </>
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
