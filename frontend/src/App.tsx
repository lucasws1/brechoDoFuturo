import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { ProductsProvider } from "./contexts/ProductsContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage"; // Importa a página de Checkout
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />{" "}
              {/* Adiciona a rota de Checkout */}
            </Routes>
            <Toaster />
          </MainLayout>
        </Router>
      </CartProvider>
    </ProductsProvider>
  );
}

export default App;
