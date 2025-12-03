// src/components/EditScheduleModal.jsx
import React, { useState, useEffect } from "react";
import { updateSchedule, deleteSchedule } from "../api/schedule";

export default function EditScheduleModal({ open, onClose, item, onSave }) {
  const [title, setTitle] = useState("");
  const [weekday, setWeekday] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setWeekday(Number(item.weekday || 0));
      setStartTime(item.start_time || "");
      setLocation(item.location || "");
    }
  }, [item]);

  if (!open) return null;

  async function handleSave() {
    if (!item) return;
    const updated = { id: item.id, title, weekday, start_time: startTime, location };
    try {
      await updateSchedule(item.id, updated);
      onSave?.(updated);
    } catch (e) {
      console.error("updateSchedule error", e);
    } finally {
      onClose?.();
    }
  }

  async function handleDelete() {
    if (!item) return;
    try {
      await deleteSchedule(item.id);
      onSave?.({ ...item, deleted: true });
    } catch (e) {
      console.error("deleteSchedule error", e);
    } finally {
      onClose?.();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">Edit Class</h2>

        <label className="block font-medium mb-1">Title</label>
        <input className="w-full mb-3 p-2 border rounded-lg bg-gray-50" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label className="block font-medium mb-1">Weekday</label>
        <select className="w-full mb-3 p-2 border rounded-lg bg-gray-50" value={weekday} onChange={(e) => setWeekday(Number(e.target.value))}>
          <option value={0}>Mon</option>
          <option value={1}>Tue</option>
          <option value={2}>Wed</option>
          <option value={3}>Thu</option>
          <option value={4}>Fri</option>
          <option value={5}>Sat</option>
          <option value={6}>Sun</option>
        </select>

        <label className="block font-medium mb-1">Start Time</label>
        <input type="time" className="w-full mb-3 p-2 border rounded-lg bg-gray-50" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

        <label className="block font-medium mb-1">Location</label>
        <input className="w-full mb-4 p-2 border rounded-lg bg-gray-50" value={location} onChange={(e) => setLocation(e.target.value)} />

        <div className="flex justify-between mt-4">
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
