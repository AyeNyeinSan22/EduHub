// src/components/TopBar.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function TopBar() {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // format time and date similar to Figma
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString();

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded shadow-sm">
      {/* Search / language etc placeholders */}
      <div className="flex-1 flex items-center gap-3">
        <div className="rounded-full bg-white border px-3 py-1">All ▾</div>
        <input className="flex-1 rounded-full border px-4 py-2" placeholder="Search"/>
      </div>

      <div className="flex items-center gap-4">
        <div className="rounded-full border px-3 py-1">{timeStr} HRS</div>
        <div className="rounded-full border px-3 py-1">{dateStr}</div>

        {/* user avatar + name */}
        <div className="flex items-center gap-2 bg-white border rounded-full px-3 py-1">
          <img
            src={user?.avatar_url || "/default-avatar.png"}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
          <span className="font-medium">{user?.name || "Guest"}</span>
        </div>
      </div>
    </div>
  );
}
