import React, { useState } from "react";
import { uploadSchedule } from "../api/schedule";

export default function ScheduleUploadModal({ open, onClose, onUploaded }) {
  const emptyItem = { title: "", weekday: 0, start_time: "", location: "" };
  const [items, setItems] = useState([emptyItem]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  function addRow() {
    setItems((s) => [...s, { ...emptyItem }]);
  }

  function removeRow(index) {
    setItems((s) => s.filter((_, i) => i !== index));
  }

  function updateField(i, field, value) {
    setItems((s) => {
      const copy = [...s];
      copy[i] = { ...copy[i], [field]: value };
      return copy;
    });
  }

  function validateItems() {
    // require at least one row with a title
    return items.some(
      (it) => it.title?.trim() && it.start_time?.trim()
    );
  }

  async function handleUpload() {
    setError("");
    if (!validateItems()) {
      setError("Please add at least one class with title and time.");
      return;
    }
    setUploading(true);
    try {
      await uploadSchedule(items);
      // success: clear and call parent refresh
      setItems([emptyItem]);
      onUploaded?.();
      onClose?.();
    } catch (e) {
      console.error("Upload schedule error", e);
      setError("Upload failed. Check server logs.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">Upload Schedule</h2>

        <div className="max-h-[46vh] overflow-y-auto space-y-3 pr-2">
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 bg-gray-50 p-3 rounded-lg items-center">
              <input
                className="col-span-4 border p-2 rounded"
                placeholder="Title"
                value={it.title}
                onChange={(e) => updateField(i, "title", e.target.value)}
              />
              <select
                className="col-span-2 border p-2 rounded"
                value={it.weekday}
                onChange={(e) => updateField(i, "weekday", Number(e.target.value))}
              >
                <option value={0}>Mon</option>
                <option value={1}>Tue</option>
                <option value={2}>Wed</option>
                <option value={3}>Thu</option>
                <option value={4}>Fri</option>
                <option value={5}>Sat</option>
                <option value={6}>Sun</option>
              </select>
              <input
                type="time"
                className="col-span-3 border p-2 rounded"
                value={it.start_time}
                onChange={(e) => updateField(i, "start_time", e.target.value)}
              />
              <input
                className="col-span-2 border p-2 rounded"
                placeholder="Location"
                value={it.location}
                onChange={(e) => updateField(i, "location", e.target.value)}
              />
              <div className="col-span-1 flex gap-2 justify-end">
                <button
                  onClick={() => removeRow(i)}
                  disabled={items.length === 1}
                  className="px-2 py-1 bg-red-100 text-red-600 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {error && <div className="text-red-600 mt-3">{error}</div>}

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={addRow}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            + Add Another Class
          </button>

          <div className="flex-1" />

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`px-4 py-2 rounded text-white ${uploading ? "bg-purple-300" : "bg-purple-600 hover:bg-purple-700"}`}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
