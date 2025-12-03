import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  BookOpen,
  Layers,
  Info,
} from "lucide-react";

export default function Sidebar() {
  const navItems = [
    { path: "/home", label: "Home", icon: <Home size={20} /> },
    { path: "/search", label: "Search", icon: <Search size={20} /> },
    { path: "/mynotes", label: "My Notes", icon: <BookOpen size={20} /> },
    { path: "/study", label: "Study Area", icon: <Layers size={20} /> },
    { path: "/about", label: "About", icon: <Info size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r flex flex-col py-6 px-4 shadow-sm">

      {/* Logo */}
      <h1 className="text-3xl font-extrabold text-orange-600 px-2 mb-10">
        UniHub
      </h1>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all 
               ${isActive ? "bg-orange-100 text-orange-600 font-semibold" : "text-gray-700 hover:bg-gray-100"}`
            }
          >
            <span className="text-orange-500">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

     
    </div>
  );
}
