import React from "react";
import { Outlet } from "react-router-dom";
import { VaultProvider } from "../context/VaultContext";
import Navbar from "../components/Navbar/Navbar";
import "./AppLayout.css";

const AppLayout = () => {
  return (
    <VaultProvider>
      <div className="app-layout">
        <Navbar />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </VaultProvider>
  );
};

export default AppLayout;