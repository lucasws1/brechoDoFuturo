import { useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge"; // shadcn
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CatLite = { name: string; slug: string; count?: number };

export type Props = {
  parentSlug: string; // slug da categoria pai (ex.: "acessorios")
  children: CatLite[]; // subcategorias do pai
  activeChildSlug?: string; // subcategoria ativa (se houver)
  showAllChip?: boolean; // exibe "Todas" (vai pro pai)
};

export function categoryUrl(parentSlug: string, childSlug?: string) {
  return childSlug
    ? `/category/${parentSlug}?sub=${childSlug}`
    : `/category/${parentSlug}`;
}

export default function SubcategoryChips({
  parentSlug,
  children,
  activeChildSlug,
  showAllChip = true,
}: Props) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () => children.filter((c) => c.slug !== activeChildSlug),
    [children, activeChildSlug],
  );

  const hasMany = items.length > 6;

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = dir === "left" ? -el.clientWidth : el.clientWidth;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const mobile = (
    <div className="w-full md:hidden">
      <Select
        onValueChange={(value) => {
          if (value === "__ALL__") navigate(categoryUrl(parentSlug));
          else navigate(categoryUrl(parentSlug, value));
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filtrar por subcategoria" />
        </SelectTrigger>
        <SelectContent>
          {showAllChip && <SelectItem value="__ALL__">Todas</SelectItem>}
          {children.map((c) => (
            <SelectItem
              key={c.slug}
              value={c.slug}
              disabled={c.slug === activeChildSlug}
            >
              {c.name}
              {typeof c.count === "number" ? ` (${c.count})` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const desktop = (
    <div className="hidden md:block">
      <div className="relative">
        {hasMany && (
          <div className="absolute top-1/2 left-0 z-10 -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollBy("left")}
              aria-label="Rolar para a esquerda"
            >
              <ChevronLeft className="size-5" />
            </Button>
          </div>
        )}

        <div
          ref={scrollRef}
          className="no-scrollbar flex items-center gap-2 overflow-x-auto px-1"
        >
          {showAllChip && (
            <Link to={categoryUrl(parentSlug)}>
              <Badge
                variant="secondary"
                className="cursor-pointer rounded-full px-3 py-1 text-sm whitespace-nowrap"
              >
                Todas
              </Badge>
            </Link>
          )}

          {items.map((c) => (
            <Link key={c.slug} to={categoryUrl(parentSlug, c.slug)}>
              <Badge
                variant="outline"
                className="hover:border-foreground/60 cursor-pointer rounded-full px-3 py-1 text-sm whitespace-nowrap"
              >
                {c.name}
                {typeof c.count === "number" ? ` (${c.count})` : ""}
              </Badge>
            </Link>
          ))}
        </div>

        {hasMany && (
          <div className="absolute top-1/2 right-0 z-10 -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollBy("right")}
              aria-label="Rolar para a direita"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {mobile}
      {desktop}
    </div>
  );
}
