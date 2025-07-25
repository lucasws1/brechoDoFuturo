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
    <header className="w-full items-center">
      {/* Topbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <div className="flex flex-1 items-center gap-2">
          <Link onClick={refetch} to="/">
            <img
              src="/logo_brecho_do_futuro.png"
              alt="Brechó do Futuro"
              className="h-20 translate-y-[4px]"
            />
          </Link>
          {/* Search */}
          <div className="relative w-full max-w-md">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Buscar produtos..."
                className="hover:bg-muted w-full focus:ring-0"
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
        <div className="flex items-center">
          <Button asChild variant="ghost" className="flex items-center">
            <Link to="/cart" className="flex items-center">
              <div className="relative flex items-center gap-1">
                <IconShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <p className="bg-secondary absolute -top-3 -right-3 rounded-full px-1 text-xs text-black">
                    {cartItems.length}
                  </p>
                )}
              </div>
            </Link>
          </Button>

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
                    className="flex items-center gap-1"
                    variant="outline"
                    onClick={logout}
                  >
                    <IconLogout className="h-4 w-4" />
                    Sair
                  </Button>
                </div>
              ) : (
                <Button className="flex items-center gap-1" asChild>
                  <Link to="/auth">
                    <IconLogin />
                    Entrar
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      {/* Categorias */}
      <div className="mt-4 flex flex-col items-center">
        <nav>
          <Tabs
            defaultValue="Todas"
            className="mx-auto mb-4 w-full max-w-[600px]"
          >
            <TabsList className="justify-center">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} asChild>
                  <Button
                    variant="link"
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
        {/* <h2 className="mb-6 text-center font-serif text-lg font-semibold text-zinc-800">
          Um presente do passado para o futuro 🎁
        </h2> */}
      </div>
    </header>
  );
}
