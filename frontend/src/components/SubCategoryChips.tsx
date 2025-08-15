import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  const items = useMemo(
    () => children.filter((c) => c.slug !== activeChildSlug),
    [children, activeChildSlug],
  );

  const mobile = (
    <div className="w-full md:hidden">
      <Select
        onValueChange={(value) => {
          if (value === "__ALL__") navigate(categoryUrl(parentSlug));
          else navigate(categoryUrl(parentSlug, value));
        }}
      >
        <SelectTrigger
          className="w-fit max-w-[200px] cursor-pointer justify-start border-none px-0 text-left shadow-none focus:ring-0"
          size="sm"
        >
          <SelectValue placeholder="Subcategorias" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {showAllChip && activeChildSlug !== undefined && (
            <SelectItem value="__ALL__">Todas</SelectItem>
          )}
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
        <div className="flex items-center overflow-x-auto">
          {showAllChip && activeChildSlug !== undefined && (
            <Link to={categoryUrl(parentSlug)}>
              <Button
                variant="ghost"
                className="mr-6 cursor-pointer px-0 hover:bg-transparent hover:underline"
                size="sm"
              >
                Mostrar Tudo
              </Button>
            </Link>
          )}
          <div className="flex items-center gap-6">
            {items.map((c) => (
              <Link key={c.slug} to={categoryUrl(parentSlug, c.slug)}>
                <Button
                  variant="ghost"
                  className="cursor-pointer px-0 hover:bg-transparent hover:underline"
                  size="sm"
                >
                  {c.name}
                  {typeof c.count === "number" ? ` (${c.count})` : ""}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {mobile}
      {desktop}
    </div>
  );
}
