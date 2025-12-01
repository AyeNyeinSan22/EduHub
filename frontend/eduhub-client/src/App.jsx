// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import RemindersPage from "./pages/Reminders";
import ReminderForm from "./pages/ReminderForm";
import StudyArea from "./pages/StudyArea";
import MyNotes from "./pages/MyNotes";
import AddNote from "./pages/AddNote";
import EditNote from "./pages/EditNote";
import ReadNote from "./pages/ReadNote";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>

      {/* AUTH PAGES (NO SIDEBAR + NO TOPBAR) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* MAIN APP (WITH LAYOUT) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="mynotes" element={<MyNotes />} />
        <Route path="notes/new" element={<AddNote />} />
        <Route path="notes/edit/:id" element={<EditNote />} />
        <Route path="notes/read/:id" element={<ReadNote />} />
        <Route path="/study" element={<StudyArea/>} />
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/reminders/new" element={<ReminderForm />} />
        <Route path="/reminders/edit/:id" element={<ReminderForm />} />
      </Route>

    </Routes>
  );
}
