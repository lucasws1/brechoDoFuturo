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
    <header className="w-full">
      {/* Topbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-4">
        {/* Logo */}
        <a
          href="/"
          className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent"
        >
          Brechó do Futuro
        </a>
        {/* Search */}
        <div className="mx-2 max-w-lg flex-1">
          <Input placeholder="Buscar produtos..." className="w-full" />
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost">
            <IconShoppingCart className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <IconUser className="h-5 w-5" />
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-1"
            variant="outline"
          >
            <IconLogin className="h-4 w-4" />
            Entrar
          </Button>
        </div>
      </div>
      {/* Categorias */}
      <nav className="bg-muted border-b">
        <ul className="mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-x-auto px-4 py-2">
          {categories.map((cat) => (
            <li key={cat}>
              <a
                href={`/categoria/${cat.toLowerCase()}`}
                className="text-md font-medium hover:underline"
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
