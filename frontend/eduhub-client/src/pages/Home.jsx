// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// API
import { getNotes, deleteNote } from "../api/notes";

// Components
import NotesCard from "../components/NotesCard";
import ReminderCarousel from "../components/ReminderCarousel";
import ScheduleCard from "../components/ScheduleCard";
import useDarkMode from "../hooks/useDarkMode";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const navigate = useNavigate();
  const [dark, setDark] = useDarkMode();

  /* ===============================
        LOAD NOTES ON PAGE LOAD
  ================================ */
  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const data = await getNotes();

      const sorted = data.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );

      setNotes(sorted);
      setRecentNotes(sorted.slice(0, 4));
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  }

  /* ===============================
        DELETE NOTE
  ================================ */
  async function handleDelete(id) {
    try {
      await deleteNote(id);
      await loadNotes();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  /* ===============================
        UI
  ================================ */
  return (
    <div
      className={`min-h-screen p-6 md:p-10 transition-all ${
        dark ? "bg-gray-900 text-white" : "bg-[#F8F8F8]"
      }`}
    >
      <div className="max-w-7xl mx-auto">

        {/* ===========================
            DARK MODE TOGGLE
        ============================ */}
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={() => setDark((d) => !d)}
            className="px-3 py-1 border rounded-lg shadow bg-white hover:bg-gray-100 text-black"
          >
            {dark ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        {/* ===========================
            REMINDER (FULL WIDTH)
        ============================ */}
        <div className="mb-10">
          <ReminderCarousel />
        </div>

        {/* ===========================
            SCHEDULE (FULL WIDTH & WIDER)
        ============================ */}
        <div className="mb-10">
          <ScheduleCard />
        </div>

        {/* ===========================
            GREETING
        ============================ */}
        <h2 className="text-3xl font-bold mb-4">
          Good Morning, Hazel 🌞
        </h2>

        {/* ===========================
            RECENT REVIEW
        ============================ */}
        <div className="mt-6 mb-10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Recent Review</h3>

            <button
              onClick={() => navigate("/mynotes")}
              className="text-sm text-gray-500 hover:underline"
            >
              See all
            </button>
          </div>

          {recentNotes.length === 0 ? (
            <p className="text-gray-500">No recent notes yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recentNotes.map((note) => (
                <NotesCard
                  key={note.id}
                  note={note}
                  onRead={() => navigate(`/notes/read/${note.id}`)}
                  onEdit={() => navigate(`/notes/edit/${note.id}`)}
                  onDelete={() => handleDelete(note.id)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
