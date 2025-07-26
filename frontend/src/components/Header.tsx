import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useProductsContext } from "@/contexts/ProductsContext";
import {
  IconLogin,
  IconSearch,
  IconSettings,
  IconShoppingCart,
} from "@tabler/icons-react";
import {
  ChevronDown,
  CircleUser,
  LogOut,
  Package,
  UserPen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CategoriesTabs } from "./CategoriesTabs";

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
    <header className="mb-4 w-full items-center border-b border-gray-200 pb-4">
      {/* Topbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <div className="flex flex-1 items-center gap-4">
          <Link onClick={refetch} to="/">
            <img
              src="/logo_brecho.png"
              alt="Brechó do Futuro"
              className="mt-1.5 h-12 w-full"
            />
          </Link>
          {/* Search */}
          <div className="relative mr-2 h-full w-full max-w-md items-center">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Buscar produtos..."
                className="hover:bg-muted h-11 w-full rounded-md shadow-xs focus:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute top-0 right-0 flex h-full items-center">
                <Button variant="link" type="submit" className="cursor-pointer">
                  <IconSearch className="text-muted-foreground h-5 w-5 sm:hidden lg:flex" />
                </Button>
              </div>
            </form>
          </div>
        </div>
        {/* Categorias */}

        <CategoriesTabs />
        <div className="mx-4 h-8 w-px bg-zinc-300" />

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="flex items-center">
            <Link to="/cart" className="flex items-center">
              <div className="relative flex items-center gap-1">
                <IconShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <p className="bg-secondary absolute -top-3 -right-3 rounded-full px-1 text-xs text-black">
                    {cartItems.length}
                  </p>
                )}
              </div>
            </Link>
          </button>

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

                  <button className="flex items-center gap-1 px-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 px-2"
                        >
                          <CircleUser className="h-6 w-6 -translate-y-[1px]" />
                          <p className="hidden font-sans text-sm md:flex">
                            Olá, {user.name.split(" ")[0]}
                          </p>
                          <ChevronDown className="text-muted-foreground h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Link to="/profile">
                            <UserPen /> Perfil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/profile?tab=orders">
                            <Package />
                            Pedidos
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={logout}>
                          <LogOut />
                          Sair
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button className="w-items-center flex gap-1">
                    <IconLogin className="h-5 w-5" />
                    Entrar
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
