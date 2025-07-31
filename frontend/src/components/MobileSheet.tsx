import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProductsContext } from "@/contexts/ProductsContext";
import { categories } from "@/data/categories";
import {
  AlignJustify,
  Shirt,
  Watch,
  Home,
  Package,
  Sparkles,
  Tag,
  Zap,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const MobileSheet = () => {
  const { handleCategoryChange, selectedCategory } = useProductsContext();
  const [parentCategory, setParentCategory] = useState<string | null>(null);

  // Função para mapear ícones para categorias
  const getCategoryIcon = (categoryName: string) => {
    const iconMap = {
      Todas: <Package className="h-5 w-5" />,
      Novidades: <Sparkles className="h-5 w-5" />,
      Ofertas: <Tag className="h-5 w-5" />,
      Roupas: <Shirt className="h-5 w-5" />,
      Acessórios: <Watch className="h-5 w-5" />,
      Casa: <Home className="h-5 w-5" />,
      Diversos: <Zap className="h-5 w-5" />,
    };
    return (
      iconMap[categoryName as keyof typeof iconMap] || (
        <Package className="h-5 w-5" />
      )
    );
  };

  return (
    <Sheet aria-describedby={undefined}>
      <SheetTrigger className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:bg-violet-50 hover:text-violet-700">
        <AlignJustify className="cursor-pointer" color="black" size={20} />
      </SheetTrigger>
      <SheetContent className="flex w-[320px] flex-col bg-gradient-to-b from-violet-50 to-white">
        <SheetHeader className="border-b border-violet-100 pb-4">
          <SheetTitle className="flex items-center justify-start gap-3 pl-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg">
              <img
                src="/logo_brecho_3_peq.png"
                alt="logo"
                className="h-8 w-auto object-contain brightness-0 invert filter"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-neutral-900">
                Categorias
              </span>
              <span className="text-sm font-medium text-violet-600">
                Encontre o que procura
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col py-4">
          <Accordion type="multiple" className="flex w-full flex-col space-y-2">
            {categories.map((cat) =>
              cat.subcategorias && cat.subcategorias.length > 0 ? (
                <AccordionItem
                  key={cat.nome}
                  value={cat.nome}
                  className="rounded-lg border border-violet-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <AccordionTrigger
                    className={`group flex w-full items-center rounded-t-lg px-4 py-3 text-base font-semibold transition-all duration-200 hover:bg-violet-50 ${
                      parentCategory === cat.nome
                        ? "bg-violet-100 text-violet-700"
                        : "text-violet-900 hover:text-violet-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`transition-colors duration-200 ${
                          parentCategory === cat.nome
                            ? "text-violet-600"
                            : "text-violet-500"
                        }`}
                      >
                        {getCategoryIcon(cat.nome)}
                      </div>
                      <span>{cat.nome}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3">
                    <div className="mt-2 ml-2 space-y-1 border-l-2 border-violet-200 pl-4">
                      {cat.subcategorias.map((sub, index) => (
                        <div
                          key={sub}
                          className="animate-in slide-in-from-left-2 duration-200"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <SheetClose
                            onClick={() => {
                              handleCategoryChange(sub);
                              setParentCategory(cat.nome);
                            }}
                            className={`group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-violet-50 hover:shadow-sm ${
                              selectedCategory === sub
                                ? "bg-violet-100 font-semibold text-violet-700 shadow-sm"
                                : "text-gray-600 hover:text-violet-700"
                            }`}
                          >
                            <ChevronRight className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
                            <span className="capitalize">{sub}</span>
                          </SheetClose>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <AccordionItem
                  key={cat.nome}
                  value={cat.nome}
                  className="border-none"
                >
                  <SheetClose
                    className={`group flex w-full items-center justify-start gap-3 rounded-lg border border-violet-100 bg-white px-4 py-3 text-base font-semibold shadow-sm transition-all duration-200 hover:bg-violet-50 hover:shadow-md ${
                      parentCategory === cat.nome
                        ? "bg-violet-100 text-violet-700 shadow-md"
                        : "text-violet-900 hover:text-violet-700"
                    }`}
                    onClick={
                      cat.nome === "Todas"
                        ? () => {
                            handleCategoryChange("");
                            setParentCategory(null);
                          }
                        : () => {
                            handleCategoryChange(cat.nome);
                            setParentCategory(cat.nome);
                          }
                    }
                  >
                    <div
                      className={`transition-colors duration-200 ${
                        parentCategory === cat.nome
                          ? "text-violet-600"
                          : "text-violet-500 group-hover:text-violet-600"
                      }`}
                    >
                      {getCategoryIcon(cat.nome)}
                    </div>
                    <span>{cat.nome}</span>
                  </SheetClose>
                </AccordionItem>
              ),
            )}
          </Accordion>
        </div>
        <SheetFooter className="border-t border-violet-100 pt-4">
          <SheetClose asChild>
            <Button
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-violet-600 hover:to-purple-700 hover:shadow-xl"
              size="lg"
            >
              Fechar Menu
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSheet;
