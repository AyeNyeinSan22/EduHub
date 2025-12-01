// src/pages/ReminderForm.jsx
import React, { useEffect, useState } from "react";
import { createReminder, getReminders, updateReminder } from "../api/reminders";
import { useNavigate, useParams } from "react-router-dom";

export default function ReminderForm() {
  const { id } = useParams(); // id present for edit
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [remindAt, setRemindAt] = useState(""); // ISO 8601 local datetime input
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadExisting();
  }, [id]);

  async function loadExisting() {
    setLoading(true);
    try {
      // reuse getReminders for simplicity (or call backend single-note if exists)
      const all = await getReminders();
      const r = all.find((x) => x.id === Number(id));
      if (r) {
        setTitle(r.title || "");
        setDescription(r.description || "");
        // convert ISO to input datetime-local format (strip seconds)
        const dt = new Date(r.remind_at);
        const tzOffset = dt.getTimezoneOffset() * 60000;
        const localISO = new Date(dt - tzOffset).toISOString().slice(0,16);
        setRemindAt(localISO);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !remindAt) return alert("Title and remind date/time required");

    const iso = new Date(remindAt).toISOString();
    try {
      if (id) {
        await updateReminder(id, { title, description, remind_at: iso });
      } else {
        await createReminder({ title, description, remind_at: iso });
      }
      navigate("/reminders");
    } catch (err) {
      console.error(err);
      alert("Failed to save reminder");
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{id ? "Edit" : "New"} Reminder</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Remind at</label>
          <input type="datetime-local" value={remindAt} onChange={(e)=>setRemindAt(e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded" />
        </div>

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={()=>navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded">{id ? "Save" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}
