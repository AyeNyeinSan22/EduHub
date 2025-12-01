// src/components/ScheduleEditModal.jsx
import React, { useState, useEffect } from "react";
import { updateSchedule, deleteSchedule } from "../api/schedule";

export default function ScheduleEditModal({ open, onClose, item, refresh }) {
  const [title, setTitle] = useState("");
  const [weekday, setWeekday] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setWeekday(item.weekday);
      setStartTime(item.start_time);
      setLocation(item.location);
    }
  }, [item]);

  if (!open) return null;

  async function handleSave() {
    await updateSchedule(item.id, {
      title,
      weekday,
      start_time: startTime,
      location,
    });
    refresh();
    onClose();
  }

  async function handleDelete() {
    await deleteSchedule(item.id);
    refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">

        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Edit Class
        </h2>

        {/* Title */}
        <label className="block font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          className="w-full mb-3 p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Weekday */}
        <label className="block font-medium text-gray-700 mb-1">Weekday</label>
        <select
          className="w-full mb-3 p-2 border rounded-lg bg-gray-50"
          value={weekday}
          onChange={(e) => setWeekday(Number(e.target.value))}
        >
          <option value={0}>Mon</option>
          <option value={1}>Tue</option>
          <option value={2}>Wed</option>
          <option value={3}>Thu</option>
          <option value={4}>Fri</option>
          <option value={5}>Sat</option>
          <option value={6}>Sun</option>
        </select>

        {/* Start time */}
        <label className="block font-medium text-gray-700 mb-1">Start Time</label>
        <input
          type="time"
          className="w-full mb-3 p-2 border rounded-lg bg-gray-50"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        {/* Location */}
        <label className="block font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded-lg bg-gray-50"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
