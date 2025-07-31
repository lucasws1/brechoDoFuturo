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
        cat.subcategorias && cat.subcategorias.length > 0 ? (
          <DropdownMenu key={cat.nome}>
            <DropdownMenuTrigger
              className={`text-md flex cursor-pointer items-center tracking-tighter text-black lowercase hover:text-purple-700 ${parentCategory === cat.nome && "font-semibold text-purple-800"}`}
            >
              {cat.nome} <ChevronDown size={14} className="mt-[4px] ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl bg-white text-black">
              <DropdownMenuGroup>
                {cat.subcategorias.map((sub) => (
                  <DropdownMenuItem
                    key={sub}
                    onClick={() => {
                      handleCategoryChange(sub);
                      setParentCategory(cat.nome);
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
            key={cat.nome}
            onClick={() => {
              cat.nome === "Todas"
                ? handleCategoryChange("")
                : handleCategoryChange(cat.nome);
              setParentCategory("");
            }}
            className={cn(
              "text-md cursor-pointer tracking-tighter text-black lowercase hover:text-purple-700",
              selectedCategory === "" &&
                cat.nome === "Todas" &&
                "font-semibold text-purple-800",
              cat.nome === selectedCategory && "font-semibold text-purple-800",
            )}
          >
            {cat.nome}
          </button>
        ),
      )}
    </div>
  );
}
