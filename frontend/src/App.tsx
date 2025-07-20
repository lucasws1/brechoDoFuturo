import { MainLayout } from "./layouts/MainLayout";
import { ProductsProvider } from "./contexts/ProductsContext";
import Home from "./pages/Home";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <ProductsProvider>
        <MainLayout>
          <Home />
          <Toaster />
        </MainLayout>
      </ProductsProvider>
    </>
  );
}

export default App;
