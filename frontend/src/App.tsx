import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { ProductsProvider } from "./contexts/ProductsContext";
import Home from "./pages/Home";
import { ProductPage } from "./pages/ProductPage"; // Importa a nova página
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ProductsProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductPage />} />
            {/* Adicione outras rotas aqui no futuro */}
          </Routes>
          <Toaster />
        </MainLayout>
      </Router>
    </ProductsProvider>
  );
}

export default App;
