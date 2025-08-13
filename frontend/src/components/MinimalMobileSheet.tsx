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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CoatHangerIcon } from "@phosphor-icons/react";
import {
  AlignJustify,
  ChevronRight,
  Home,
  Package,
  Shirt,
  Sparkles,
  Tag,
  Watch,
  Zap,
} from "lucide-react";
import { categories } from "@/data/categories";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Função para mapear ícones para categorias
const getCategoryIcon = (categoryName: string) => {
  const iconMap = {
    Explorar: <Package className="h-5 w-5" />,
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

const MinimalMobileSheet = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const sheetCloseRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleCategoryClick = (cat: any, sub?: string) => {
    if (openCategory === cat.name) {
      navigate(
        sub
          ? `/category/${toSlug(cat.name)}?sub=${toSlug(sub)}`
          : `/category/${toSlug(cat.name)}`,
      );
      sheetCloseRef.current?.click();
      setOpenCategory(null);
    } else {
      setOpenCategory(cat.name);
    }
  };

  const toSlug = (input: string): string => {
    return input
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const active = "font-bold";
  const idle = "cursor-pointer";

  return (
    <Sheet>
      <SheetTrigger
        onClick={() => setOpenCategory(null)}
        className="inline-flex cursor-pointer items-center justify-center p-2"
      >
        <AlignJustify className="cursor-pointer" color="black" size={20} />
      </SheetTrigger>
      <SheetContent className="flex w-[320px] flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-start gap-3">
            <CoatHangerIcon size={20} color="black" />
            <span className="text-lg font-bold">Categorias</span>
          </SheetTitle>
          <SheetDescription>Selecione a categoria desejada</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col py-4">
          <Accordion type="single" className="flex w-full flex-col space-y-2">
            {categories.map((cat) =>
              cat.subcategories && cat.subcategories.length > 0 ? (
                <AccordionItem
                  key={cat.name}
                  value={cat.name}
                  className="border-none"
                >
                  <AccordionTrigger
                    onClick={() => handleCategoryClick(cat)}
                    className={`group flex w-full items-center px-4 py-3 text-base font-normal ${
                      cat.name !== "Explorar" &&
                      location.pathname === `/category/${toSlug(cat.name)}`
                        ? active
                        : idle
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(cat.name)}
                      {cat.name}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3">
                    <div className="mt-2 ml-2 space-y-1 pl-4">
                      {cat.subcategories.map((sub, index) => (
                        <div
                          key={sub}
                          className="animate-in slide-in-from-left-2"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <SheetClose
                            onClick={() => handleCategoryClick(cat, sub)}
                            className="group flex w-full items-center gap-2 px-3 py-2"
                          >
                            <ChevronRight className="h-3 w-3" />
                            <span>{sub}</span>
                          </SheetClose>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <AccordionItem
                  key={cat.name}
                  value={cat.name}
                  className="border-none"
                >
                  <Link
                    to={
                      cat.name === "Explorar"
                        ? "/"
                        : `/category/${toSlug(cat.name)}`
                    }
                  >
                    <SheetClose
                      className={`group flex w-full items-center justify-start gap-3 px-4 py-3 ${
                        (cat.name === "Explorar" &&
                          location.pathname === "/") ||
                        location.pathname === `/category/${toSlug(cat.name)}`
                          ? active
                          : idle
                      }`}
                    >
                      <div>{getCategoryIcon(cat.name)}</div>

                      {cat.name}
                    </SheetClose>
                  </Link>
                </AccordionItem>
              ),
            )}
          </Accordion>
        </div>
        <SheetFooter className="pt-4">
          <SheetClose asChild>
            <Button className="w-full py-3 font-semibold" size="lg">
              Fechar Menu
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
      <SheetClose ref={sheetCloseRef} className="hidden" />
    </Sheet>
  );
};

export default MinimalMobileSheet;
