// src/components/RecentNotesCard.jsx
import React, { useEffect, useState } from "react";
import { getNotes } from "../api/notes";
import { useNavigate } from "react-router-dom";

export default function RecentNotesCard({ className = "" }) {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getNotes(); // returns array
        if (!mounted) return;
        setNotes(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load notes:", err);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg ${className}`}>
      <h3 className="flex items-center gap-3 font-semibold mb-4">
        <span className="text-indigo-600">📘</span> Recent Notes
      </h3>

      <div className="space-y-3 mb-4">
        {notes.length === 0 && <p className="text-gray-500">No recent notes</p>}
        {notes.map(n => (
          <div key={n.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">{n.title}</div>
              <div className="text-xs text-gray-500">{n.subject}</div>
            </div>
            <button onClick={() => navigate(`/notes/read/${n.id}`)} className="text-sm text-blue-600">Open</button>
          </div>
        ))}
      </div>

      <button onClick={() => navigate("/mynotes")} className="w-full py-2 bg-blue-600 text-white rounded-lg">
        View All Notes
      </button>
    </div>
  );
}
