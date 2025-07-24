import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useProductsContext } from "@/contexts/ProductsContext";
import {
  IconLogin,
  IconLogout,
  IconSearch,
  IconSettings,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

const categories = [
  "Todas",
  "Novidades",
  "Ofertas",
  "Masculino",
  "Feminino",
  "Infantil",
];

export function Header() {
  const { refetch } = useProductsContext();
  const {
    searchTerm,
    setSearchTerm,
    handleSearch,
    selectedCategory,
    handleCategoryChange,
  } = useProductsContext();
  const { cartItems } = useCart();
  const { isAuthenticated, user, logout, loading } = useAuth(); // Obtém o estado de autenticação

  return (
    <header className="w-full items-center border-b shadow-sm">
      {/* Topbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex flex-1 items-center gap-4">
          <Link onClick={refetch} to="/">
            <img
              src="/brecho_logo.png"
              alt="Brechó do Futuro"
              className="h-12 w-auto"
            />
          </Link>
          {/* Search */}
          <div className="relative w-full max-w-md">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Buscar produtos..."
                className="hover:bg-muted focus:bg-muted h-11 w-full rounded border shadow-sm focus:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute top-0 right-0 flex h-full items-center">
                <Button variant="link" type="submit" className="cursor-pointer">
                  <IconSearch className="text-muted-foreground h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to="/cart">
            <Button size="icon" variant="ghost" className="relative">
              <IconShoppingCart className="relative h-5 w-5" />
              {cartItems.length > 0 && (
                <p className="bg-secondary text-primary absolute -top-1 -right-1 rounded-full px-1 text-xs">
                  {cartItems.length}
                </p>
              )}
            </Button>
          </Link>

          {!loading && (
            <>
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  {user.type === "Admin" && (
                    <Link to="/admin">
                      <Button size="icon" variant="ghost" title="Painel Admin">
                        <IconSettings className="h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile">
                    <Button size="icon" variant="ghost">
                      <IconUser className="h-5 w-5" />
                    </Button>
                  </Link>
                  <span className="hidden text-sm md:block">
                    Olá, {user.name.split(" ")[0]}
                  </span>
                  <Button
                    size="sm"
                    className="flex items-center gap-1"
                    variant="outline"
                    onClick={logout}
                  >
                    <IconLogout className="h-4 w-4" />
                    Sair
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button
                    size="sm"
                    className="flex items-center gap-1 shadow-sm"
                    variant="outline"
                  >
                    <IconLogin className="h-4 w-4" />
                    Entrar
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
      {/* Categorias */}
      <div className="mt-4 flex flex-col items-center">
        <h2 className="text-center font-serif text-lg font-semibold text-zinc-800">
          Um presente do passado para o futuro 🎁
        </h2>

        <nav>
          <Tabs
            defaultValue="Todas"
            className="mx-auto mt-2 mb-4 w-full max-w-[600px]"
          >
            <TabsList className="justify-center">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} asChild>
                  <Button
                    variant="ghost"
                    onClick={
                      cat === "Todas"
                        ? () => handleCategoryChange("")
                        : () => handleCategoryChange(cat)
                    }
                    className={cat === "Todas" ? "font-bold" : ""}
                  >
                    {cat}
                  </Button>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </nav>
      </div>
    </header>
  );
}
