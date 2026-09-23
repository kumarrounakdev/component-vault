import { Outlet } from "react-router-dom";
import { VaultProvider } from "./context/VaultContext";
import { ToastProvider } from "./components/Toast/ToastContext";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";

const App = () => {
  return (
    <VaultProvider>
      <ToastProvider>
        <div className="app-layout">
          <Navbar />
          <main className="app-layout__content">
            <Outlet />
          </main>
        </div>
      </ToastProvider>
    </VaultProvider>
  );
};

export default App;