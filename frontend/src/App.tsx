import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthCartSync } from "./components/AuthCartSync";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { MainLayout } from "./layouts/MainLayout";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import ContactPage from "./pages/ContactPage";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AuthCartSync />
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/search" element={<SearchPage />} />

              <Route path="/checkout" element={<ProtectedRoute />}>
                <Route index element={<CheckoutPage />} />
              </Route>
              <Route path="/profile" element={<ProtectedRoute />}>
                <Route index element={<ProfilePage />} />
              </Route>
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route index element={<AdminPage />} />
              </Route>
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </MainLayout>
        </CartProvider>
        <Toaster
          // position="top-right"
          position="top-right"
          // expand={true}
          // richColors={true}
          closeButton={true}
          toastOptions={{
            duration: 3000,
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
