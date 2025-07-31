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
import { SignInIcon } from "@phosphor-icons/react";
import {
  IconSearch,
  IconSettings,
  IconShoppingCart,
} from "@tabler/icons-react";
import {
  ChevronDown,
  LogOut,
  Package,
  UserCircle2,
  UserPen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CategoriesTabs } from "./CategoriesTabs";
import MobileSheet from "./MobileSheet";

export function Header() {
  const { refetch } = useProductsContext();
  const { searchTerm, setSearchTerm, handleSearch } = useProductsContext();
  const { cartItems } = useCart();
  const { isAuthenticated, user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-violet-100 bg-gradient-to-r from-white via-violet-50 to-white shadow-sm backdrop-blur-sm">
      {/* Topbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex flex-1 items-center gap-4">
          <Link onClick={refetch} to="/" className="group">
            <img
              src="/logo_brecho_3_1.png"
              alt="Brechó do Futuro"
              className="hidden h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105 md:flex"
            />
            <img
              src="/logo_brecho_3_peq.png"
              alt="Brechó do Futuro"
              className="h-fill max-h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105 md:hidden"
            />
          </Link>
          {/* Search */}
          <div className="relative mr-2 h-full w-full max-w-xs items-center lg:max-w-sm">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative w-full">
                <Input
                  placeholder="Buscar produtos..."
                  className="mt-1 h-11 w-full max-w-xs rounded-xl border-violet-200 bg-white/80 pr-12 pl-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-200 lg:max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute top-1 right-2 flex h-full items-center">
                  <button
                    type="submit"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 text-white transition-all duration-200 hover:bg-violet-600 hover:shadow-md"
                  >
                    <IconSearch size={16} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden lg:flex lg:items-center">
          <CategoriesTabs />
          <div className="mx-4 h-6 w-px bg-gradient-to-b from-transparent via-violet-300 to-transparent" />
        </div>

        {/* Actions */}
        <div className="ml-2 flex items-center gap-3 md:ml-0">
          <Link to="/cart" className="group relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 transition-all duration-200 hover:bg-violet-50 hover:shadow-md">
              <IconShoppingCart
                className="text-violet-600 transition-colors duration-200 group-hover:text-violet-700"
                size={20}
              />
              {cartItems.length > 0 && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-xs font-semibold text-white shadow-lg">
                  {cartItems.length > 9 ? "9+" : cartItems.length}
                </div>
              )}
            </div>
          </Link>

          {!loading && (
            <>
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  {user.type === "Admin" && (
                    <Link to="/admin">
                      <button
                        title="Painel Admin"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition-all duration-200 hover:bg-orange-200 hover:shadow-md"
                      >
                        <IconSettings size={18} />
                      </button>
                    </Link>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 rounded-full bg-white/80 px-1 py-2 transition-all duration-200 hover:bg-violet-50 hover:shadow-md">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-600">
                          <UserCircle2 size={16} className="text-white" />
                        </div>
                        <div className="hidden flex-col items-start md:flex">
                          <p className="text-sm font-medium text-gray-700">
                            Olá, {user.name.split(" ")[0]}
                          </p>
                        </div>
                        <ChevronDown size={14} className="text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 rounded-xl border border-violet-100 bg-white/95 p-2 shadow-lg backdrop-blur-sm">
                      <DropdownMenuItem
                        asChild
                        className="rounded-lg transition-colors duration-200 hover:bg-violet-50 focus:bg-violet-50"
                      >
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2"
                        >
                          <UserPen size={16} className="text-violet-600" />
                          <span className="font-medium text-gray-700">
                            Perfil
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="rounded-lg transition-colors duration-200 hover:bg-violet-50 focus:bg-violet-50"
                      >
                        <Link
                          to="/profile?tab=orders"
                          className="flex items-center gap-3 px-3 py-2"
                        >
                          <Package size={16} className="text-violet-600" />
                          <span className="font-medium text-gray-700">
                            Pedidos
                          </span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={logout}
                        className="flex items-center gap-3 rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-red-50 focus:bg-red-50"
                      >
                        <LogOut size={16} className="text-red-500" />
                        <span className="font-medium text-gray-700">Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link to="/auth" className="group">
                  <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2 text-white shadow-lg transition-all duration-200 hover:from-violet-600 hover:to-purple-700 hover:shadow-xl">
                    <SignInIcon size={18} />
                    <span className="font-medium">Entrar</span>
                  </button>
                </Link>
              )}
            </>
          )}
          <div className="flex items-center lg:hidden">
            <div className="rounded-full bg-white/80 p-1 shadow-sm">
              <MobileSheet />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
