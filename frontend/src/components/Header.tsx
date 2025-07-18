import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconShoppingCart, IconUser, IconLogin } from "@tabler/icons-react";

const categories = [
  "Novidades",
  "Ofertas",
  "Masculino",
  "Feminino",
  "Infantil",
];

export function Header() {
  return (
    <header className="w-full border-b bg-background">
      {/* Topbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
        {/* Logo */}
        <a href="/" className="text-xl font-bold">
          Brechó do Futuro
        </a>
        {/* Search */}
        <div className="mx-4 max-w-lg flex-1">
          <Input placeholder="Buscar produtos..." className="w-full" />
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button size="icon">
            <IconShoppingCart className="h-5 w-5" />
          </Button>
          <Button size="icon">
            <IconUser className="h-5 w-5" />
          </Button>
          {/* Ou, se não logado: */}
          <Button size="sm" className="flex items-center gap-1">
            <IconLogin className="h-4 w-4" />
            Entrar
          </Button>
        </div>
      </div>
      {/* Categorias */}
      <nav className="border-b bg-muted">
        <ul className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-2">
          {categories.map((cat) => (
            <li key={cat}>
              <a
                href={`/categoria/${cat.toLowerCase()}`}
                className="text-sm font-medium hover:underline"
              >
                {cat}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
