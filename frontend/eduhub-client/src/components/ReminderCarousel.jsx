import React, { useEffect, useState } from "react";
import { getReminders } from "../api/reminders"; // your API file
import { useNavigate } from "react-router-dom";

export default function ReminderCarousel() {
  const [reminders, setReminders] = useState([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadReminders();
  }, []);

  async function loadReminders() {
    try {
      const data = await getReminders();
      setReminders(data || []);
    } catch (err) {
      console.error("Reminder load failed:", err);
    }
  }

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (reminders.length === 0) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % reminders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reminders]);

  return (
    <div
      className="rounded-xl shadow-lg overflow-hidden text-white p-6 min-h-[300px] flex flex-col justify-between"
      style={{
        background: "linear-gradient(120deg, #FF34A5, #8E3BFF)",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Classroom Reminder</h2>

        <button
          onClick={() => navigate("/reminders/new")}
          className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-100"
        >
          + Add Reminder
        </button>
      </div>

      {/* Empty State */}
      {reminders.length === 0 ? (
        <p>No reminders available.</p>
      ) : (
        <>
          {/* Reminder Content */}
          <p className="text-lg font-semibold">
            {reminders[index].title}
          </p>
          <p className="opacity-90 mt-1 text-sm">
            {reminders[index].description}
          </p>

          <p className="text-xs opacity-70 mt-2">
            {new Date(reminders[index].remind_at).toLocaleString()}
          </p>

          {/* Dots */}
          <div className="flex gap-2 mt-4">
            {reminders.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
