import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useProductsContext } from "@/contexts/ProductsContext";
import { CoatHangerIcon } from "@phosphor-icons/react";
import { IconSettings } from "@tabler/icons-react";
import {
  ChevronDown,
  Handbag,
  LogIn,
  LogOut,
  Package,
  Search,
  User,
  UserPen,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { categories } from "@/data/categories";
import MinimalMobileSheet from "./MinimalMobileSheet";
import { useCategoryHierarchy } from "@/hooks/useProductById";

const Header: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    handleSearch,
    selectedCategory,
    refetch,
    handleCategoryChange,
  } = useProductsContext();
  const { hierarchy } = useCategoryHierarchy(selectedCategory || null);
  const { cartItems } = useCart();
  const { isAuthenticated, user, logout, loading } = useAuth();
  const categoryNames = (hierarchy || []).map((category) => category.name);

  return (
    <header className="top-0 z-50 mx-auto flex w-full max-w-7xl items-center justify-between border-b border-solid border-b-[#f4f0f2] px-6 py-3">
      <div className="flex items-center justify-center gap-8">
        <Link onClick={refetch} to="/" className="group">
          <div className="flex items-center justify-center gap-2">
            <CoatHangerIcon size={24} className="-translate-x-[7px]" />
            <h2 className="truncate text-lg leading-tight font-bold tracking-[-0.015em] text-[#181113]">
              Brechó <span className="hidden md:inline">do Futuro</span>
            </h2>
          </div>
        </Link>
        <div>
          <NavigationMenu viewport={false} className="hidden xl:flex">
            <NavigationMenuList>
              {categories.map((cat) => (
                <NavigationMenuItem key={cat.name}>
                  {!cat.subcategories || cat.subcategories.length === 0 ? (
                    <NavigationMenuLink
                      onClick={() => handleCategoryChange(cat.name)}
                      className="cursor-pointer rounded-md text-sm leading-normal font-medium"
                    >
                      <div
                        className={`${
                          categoryNames.some(
                            (name) =>
                              name.trim().toLowerCase() ===
                              cat.name.trim().toLowerCase(),
                          ) ||
                          (cat.name === "Explorar" && selectedCategory === "")
                            ? "font-bold"
                            : "font-medium"
                        }`}
                      >
                        {cat.name}
                      </div>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger
                        className="cursor-pointer text-sm leading-normal font-medium"
                        onClick={() => handleCategoryChange(cat.name)}
                      >
                        <div
                          className={`${
                            categoryNames.some(
                              (name) =>
                                name.trim().toLowerCase() ===
                                cat.name.trim().toLowerCase(),
                            )
                              ? "font-bold"
                              : "font-medium"
                          }`}
                        >
                          {cat.name}
                        </div>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="border-none">
                        <ul className="grid w-[200px] gap-4">
                          {(cat.subcategories || []).map((sub) => (
                            <li key={sub}>
                              <NavigationMenuLink
                                onClick={() => handleCategoryChange(sub)}
                                className="cursor-pointer"
                              >
                                <div
                                  className={`${
                                    categoryNames.some(
                                      (name) =>
                                        name.trim().toLowerCase() ===
                                        sub.trim().toLowerCase(),
                                    )
                                      ? "font-bold"
                                      : "font-medium"
                                  }`}
                                >
                                  {sub}
                                </div>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4">
        <div className="hidden flex-col md:flex">
          <form
            onSubmit={handleSearch}
            className="ml-2 flex h-10 w-full max-w-2xs min-w-32 items-center justify-center"
          >
            <div className="flex h-full w-full items-stretch rounded-lg">
              <button
                type="submit"
                className="flex items-center justify-center rounded-l-lg border-r-0 border-none pl-4 text-[#89616f]"
              >
                <Search size={18} />
              </button>

              <input
                placeholder="Buscar"
                className="form-input flex h-full max-w-[160px] min-w-16 resize-none overflow-hidden rounded-lg rounded-l-none border-l-0 border-none px-4 pl-2 text-sm leading-normal font-normal text-[#181113] placeholder:text-sm placeholder:text-[#89616f] focus:border-none focus:ring-0 focus:outline-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>

        <Link
          to="/cart"
          className="group relative flex cursor-pointer items-center justify-center rounded-lg p-1"
        >
          <Handbag size={18} className="translate-x-[1px]" />
          {cartItems.length > 0 && (
            <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-black shadow-lg">
              {cartItems.length > 9 ? "9+" : cartItems.length}
            </div>
          )}
        </Link>

        {!loading && (
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <>
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
                    <button className="flex cursor-pointer items-center justify-center gap-2 p-2 text-black">
                      <User size={18} className="-translate-y-[1px]" />
                      <span className="text-sm font-medium">
                        {user.name.split(" ")[0]}
                      </span>
                      <ChevronDown size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border-none">
                    <DropdownMenuItem asChild className="rounded-lg">
                      <Link to="/profile" className="flex items-center gap-2">
                        <UserPen size={16} color="black" />
                        <span className="font-medium text-black">Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg">
                      <Link
                        to="/profile?tab=orders"
                        className="flex items-center gap-2"
                      >
                        <Package size={16} color="black" />
                        <span className="font-medium text-black">Pedidos</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-2"
                    >
                      <LogOut size={16} color="black" />
                      <span className="font-medium text-black">Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg text-sm leading-normal font-bold tracking-[0.015em]"
                type="button"
              >
                <Link to="/auth" className="group">
                  <LogIn />
                  <span>Entrar</span>
                </Link>
              </Button>
            )}
          </div>
        )}
        <div className="flex items-center xl:hidden">
          <MinimalMobileSheet />
        </div>
      </div>
    </header>
  );
};

export default Header;
