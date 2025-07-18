import "./App.css";
import { MainLayout } from "./layouts/MainLayout";
import Home from "./pages/Home";

function App() {
  return (
    <div className="dark">
      <MainLayout>
        <Home />
      </MainLayout>
    </div>
  );
}

export default App;
