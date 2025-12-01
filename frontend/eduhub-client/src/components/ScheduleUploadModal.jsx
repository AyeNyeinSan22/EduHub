import { useState } from "react";
import { uploadSchedule } from "../api/schedule";

export default function ScheduleUploadModal({ open, onClose, onUploaded }) {
  const [text, setText] = useState("");

  if (!open) return null;

  const handleUpload = async () => {
    try {
      const parsed = JSON.parse(text);

      await uploadSchedule(parsed);

      onUploaded();   // refresh schedule
      onClose();
    } catch (err) {
      alert("Invalid JSON format. Make sure it's a valid array.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-xl shadow-xl">
        <h2 className="text-lg font-bold mb-3">Upload Schedule</h2>

        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Example:
[
  {"title": "PLD", "weekday": 0, "start_time": "09:00", "location": "Room 204"},
  {"title": "DE", "weekday": 4, "start_time": "13:00", "location": "Lab 3"}
]'
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-1" onClick={onClose}>Cancel</button>
          <button
            className="px-4 py-1 bg-purple-600 text-white rounded"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
