import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ProductsProvider } from "./contexts/ProductsContext";
import { MainLayout } from "./layouts/MainLayout";
import AuthPage from "./pages/AuthPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import Home from "./pages/Home";
import { ProductPage } from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute"; // Importa o ProtectedRoute
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner"; // Importa o Toaster

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                {/* Rota de checkout protegida */}
                <Route path="/checkout" element={<ProtectedRoute />}>
                  <Route index element={<CheckoutPage />} />
                </Route>
                <Route path="/profile" element={<ProtectedRoute />}> {/* Rota de perfil protegida */}
                  <Route index element={<ProfilePage />} />
                </Route>
              </Routes>
            </MainLayout>
          </CartProvider>
        </ProductsProvider>
        <Toaster /> {/* Adiciona o Toaster aqui */}
      </AuthProvider>
    </Router>
  );
}

export default App;
