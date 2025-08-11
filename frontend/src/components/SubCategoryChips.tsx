import { useProductsSearchParams } from "@/hooks/useProductsSearchParams";
import { Button } from "./ui/button";

const SubCategoryChips = () => {
  const { params, setSubcategoryValue } = useProductsSearchParams();

  const handleSubCategoryChange = (subcategory: string) => {
    // Se a subcategoria já estiver selecionada, desmarcar
    const newSubcategory =
      params.subcategory === subcategory ? "" : subcategory;
    setSubcategoryValue(newSubcategory);
  };

  const subcategories = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
    { value: "infantil", label: "Infantil" },
  ];

  return (
    <div className="flex gap-2 text-sm">
      {subcategories.map((sub) => (
        <Button
          variant="outline"
          size="sm"
          key={sub.value}
          onClick={() => handleSubCategoryChange(sub.value)}
          className={`${params.subcategory === sub.value ? "font-bold" : ""}`}
        >
          {sub.label}
        </Button>
      ))}
    </div>
  );
};

export default SubCategoryChips;
