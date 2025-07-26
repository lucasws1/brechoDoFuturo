import { useProductsContext } from "@/contexts/ProductsContext";
import { cn } from "@/lib/utils";

export function CategoriesTabs() {
  const categorias = [
    "Todas",
    "Novidades",
    "Ofertas",
    "Masculino",
    "Feminino",
    "Infantil",
  ];

  const { handleCategoryChange, selectedCategory } = useProductsContext();

  return (
    <div className="flex gap-4">
      {categorias.map((cat) => (
        <button
          key={cat}
          onClick={
            cat === "Todas"
              ? () => handleCategoryChange("")
              : () => handleCategoryChange(cat)
          }
          className={cn(
            "cursor-pointer border-b-2 border-transparent py-1 text-sm font-medium tracking-tighter text-black hover:text-purple-600",
            selectedCategory === "" && cat === "Todas" && "border-purple-600",
            cat === selectedCategory && "border-purple-600",
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
