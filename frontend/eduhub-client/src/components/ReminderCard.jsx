import React from "react";
import { useNavigate } from "react-router-dom";

export default function ReminderCard({ reminders = [] }) {
  const navigate = useNavigate();
  const next = reminders && reminders.length ? reminders[0] : null;

  return (
    <div
      className="rounded-xl shadow-lg overflow-hidden text-white p-6 min-h-[220px] flex flex-col justify-between"
      style={{
        background: "linear-gradient(120deg, #FF34A5, #8E3BFF)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Classroom Reminder</h2>
          <p className="text-sm opacity-90 mt-1">Your upcoming reminders</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/reminders")}
            className="bg-white/20 border border-white/30 px-3 py-1 rounded-full text-sm hover:bg-white/30"
          >
            View all
          </button>

          <button
            onClick={() => navigate("/reminders/new")}
            className="bg-white text-black px-3 py-1 rounded-full text-sm hover:brightness-105"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="mt-6 flex-1">
        {next ? (
          <div>
            <h3 className="text-xl font-semibold">{next.title}</h3>
            <p className="mt-2 text-sm opacity-90">{next.description}</p>
            <p className="mt-3 text-xs opacity-80">
              {new Date(next.remind_at).toLocaleString()}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigate(`/reminders/edit/${next.id}`)}
                className="px-4 py-2 rounded-full bg-white text-black"
              >
                Edit
              </button>
              <button
                onClick={() => navigate("/reminders")}
                className="px-4 py-2 rounded-full border border-white/30"
              >
                All reminders
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm opacity-80">No reminders yet — add one to get started.</p>
        )}
      </div>

      {/* small pager */}
      <div className="flex gap-2 mt-4">
        {(reminders || []).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
