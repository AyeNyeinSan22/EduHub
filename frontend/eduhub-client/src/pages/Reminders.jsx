// src/pages/Reminders.jsx
import React, { useEffect, useState } from "react";
import { getReminders, deleteReminder } from "../api/reminders";
import { useNavigate } from "react-router-dom";

export default function RemindersPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getReminders();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this reminder?")) return;
    try {
      await deleteReminder(id);
      load();
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reminders</h1>
        <button
          onClick={() => navigate("/reminders/new")}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          + New Reminder
        </button>
      </div>

      {loading ? (
        <p>Loading..</p>
      ) : list.length === 0 ? (
        <p>No reminders yet.</p>
      ) : (
        <div className="grid gap-4">
          {list.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{r.title}</h3>
                <p className="text-xs text-gray-600">{r.description}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(r.remind_at).toLocaleString()}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => navigate(`/reminders/edit/${r.id}`)} className="px-3 py-1 bg-gray-100 rounded">Edit</button>
                <button onClick={() => handleDelete(r.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
