import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddNote from "./pages/AddNote";
import MyNotes from "./pages/MyNotes";
import Layout from "./components/Layout";
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
       <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="mynotes" element={<MyNotes />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Notes */}
        <Route path="/add-note" element={<AddNote />} />
       
      </Routes>
    </Router>
  );
}
