import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useProductsContext } from "@/contexts/ProductsContext";
import {
  IconLogin,
  IconLogout,
  IconShoppingCart,
  IconUser,
  IconSettings,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

const categories = [
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
    <header className="w-full">
      {/* Topbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-4">
        {/* Logo */}
        <Link
          onClick={refetch}
          to="/"
          className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent"
        >
          Brechó do Futuro
        </Link>
        {/* Search */}
        <div className="mx-2 max-w-lg flex-1">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Buscar produtos..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" size="sm">
              Buscar
            </Button>
          </form>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to="/cart">
            <Button
              size="icon"
              variant="ghost"
              style={{ position: "relative" }}
            >
              <IconShoppingCart className="relative h-5 w-5" />
              {cartItems.length > 0 && (
                <p className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-xs text-white">
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
                    className="flex items-center gap-1"
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
      <nav className="bg-muted border-b">
        <ul className="mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-x-auto px-4 py-2">
          {categories.map((cat) => (
            <li key={cat} className="flex items-center gap-2">
              <Button
                variant={"link"}
                onClick={() => handleCategoryChange(cat)}
                className={`cursor-pointer font-medium ${
                  selectedCategory === cat ? "text-green-500" : ""
                }`}
              >
                {cat}
              </Button>
            </li>
          ))}
          <li className="flex items-center gap-2">
            <Link to="/contact">
              <Button variant={"link"} className="cursor-pointer font-medium">
                Contato
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
