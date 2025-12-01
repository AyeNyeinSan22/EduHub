import React, { useState } from "react";
import { createReminder } from "../api/reminders";

export default function AddReminderModal({ open, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");

  const save = async () => {
    if (!title || !date) return alert("Title and date required");
    await createReminder({
      title,
      description: desc,
      remind_at: date,
    });
    onSuccess();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 w-96 p-6 rounded-xl shadow-xl space-y-4">
        <h2 className="text-xl font-bold">Add Reminder</h2>

        <input
          className="w-full px-3 py-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full px-3 py-2 border rounded"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <input
          type="datetime-local"
          className="w-full px-3 py-2 border rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
