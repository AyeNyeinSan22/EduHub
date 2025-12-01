// src/components/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8f8f8" }}>
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right main area */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <TopBar />

        {/* Page content area */}
        <div style={{ flexGrow: 1, padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
