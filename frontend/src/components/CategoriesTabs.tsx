import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProductsContext } from "@/contexts/ProductsContext";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function CategoriesTabs() {
  const { handleCategoryChange, selectedCategory } = useProductsContext();
  const [parentCategory, setParentCategory] = useState<string | null>(null);

  return (
    <div className="flex gap-4">
      {categories.map((cat) =>
        cat.subcategories && cat.subcategories.length > 0 ? (
          <DropdownMenu key={cat.name}>
            <DropdownMenuTrigger
              className={`text-md flex cursor-pointer items-center tracking-tighter text-black lowercase hover:text-purple-700 ${parentCategory === cat.name && "font-semibold text-purple-800"}`}
            >
              {cat.name} <ChevronDown size={14} className="mt-[4px] ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl bg-white text-black">
              <DropdownMenuGroup>
                {cat.subcategories.map((sub) => (
                  <DropdownMenuItem
                    key={sub}
                    onClick={() => {
                      handleCategoryChange(sub);
                      setParentCategory(cat.name);
                    }}
                    className={`text-md tracking-tighter text-black lowercase focus:bg-purple-300 focus:text-black ${selectedCategory === sub && "font-semibold text-purple-800"}`}
                  >
                    {sub}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            key={cat.name}
            onClick={() => {
              cat.name === "Todas"
                ? handleCategoryChange("")
                : handleCategoryChange(cat.name);
              setParentCategory("");
            }}
            className={cn(
              "text-md cursor-pointer tracking-tighter text-black lowercase hover:text-purple-700",
              selectedCategory === "" &&
                cat.name === "Todas" &&
                "font-semibold text-purple-800",
              cat.name === selectedCategory && "font-semibold text-purple-800",
            )}
          >
            {cat.name}
          </button>
        ),
      )}
    </div>
  );
}
