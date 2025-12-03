import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { searchNotes } from "../api/search";

export default function TopBar() {
  const { user: ctxUser, token } = useAuth();
  const [now, setNow] = useState(new Date());
  const [profile, setProfile] = useState(ctxUser || null);

  // Search states
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setProfile(ctxUser || null);
  }, [ctxUser]);

  // Fetch profile for avatar
  useEffect(() => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data) => setProfile(data))
      .catch(() => {});
  }, [token]);

  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString();

  // 🔍 RUN SEARCH
  async function handleSearch(text) {
    setQuery(text);
    if (text.trim().length < 1) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const res = await searchNotes(text);
    setResults(res);
    setShowDropdown(true);
  }

  return (
    <div className="relative flex items-center gap-4 p-4 bg-white rounded shadow-sm">

      {/* Search */}
      <div className="flex-1 relative">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white border px-3 py-1">All ▾</div>

          <input
            className="flex-1 rounded-full border px-4 py-2"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.length > 0 && setShowDropdown(true)}
          />
        </div>

        {/* 🔽 DROPDOWN RESULTS */}
        {showDropdown && results.length > 0 && (
          <div className="absolute left-20 mt-2 w-[60%] bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
            {results.map((note) => (
              <button
                key={note.id}
                onClick={() => {
                  navigate(`/readnote/${note.id}`);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                <div className="font-semibold">{note.title}</div>
                <div className="text-xs text-gray-500">
                  {note.subject} • {note.category}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Time + Date + Profile */}
      <div className="flex items-center gap-4">
        <div className="rounded-full border px-3 py-1">{timeStr} HRS</div>
        <div className="rounded-full border px-3 py-1">{dateStr}</div>

        {/* avatar */}
        <button onClick={() => navigate("/profile")} className="flex items-center gap-2 bg-white border rounded-full px-3 py-1">
          
          <span className="font-medium">{profile?.name || "Guest"}</span>
        </button>
      </div>
    </div>
  );
}
