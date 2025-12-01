// src/components/TasksCard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "tasks_v1";
const PRIORITY_LABELS = { high: "High", med: "Medium", low: "Low" };

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export default function TasksCard() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState("med");
  const [filter, setFilter] = useState("active");

  useEffect(() => setTasks(loadTasks()), []);
  useEffect(() => saveTasks(tasks), [tasks]);

  const remaining = tasks.filter((t) => !t.done).length;

  function addTask(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const t = {
      id: uuidv4(),
      text,
      due: due || null,
      priority,
      done: false,
      created_at: new Date().toISOString(),
    };

    setTasks((prev) => [t, ...prev]);
    setText("");
    setDue("");
    setPriority("med");
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const shown = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.done);
    if (filter === "done") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  return (
    <div className="bg-white shadow rounded-2xl p-6 w-full">

      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-xl font-semibold">Today's Tasks</h3>
          <p className="text-sm text-gray-500">Keep your focus — {remaining} left</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="px-3 py-1 rounded-md border text-sm bg-gray-50"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="all">All</option>
            <option value="done">Done</option>
          </select>

          <button
            onClick={() => setTasks(tasks.filter((t) => !t.done))}
            className="text-red-500 text-sm"
          >
            Clear done
          </button>
        </div>
      </div>

      {/* Modern 2-line Add Form */}
      <form onSubmit={addTask} className="space-y-3 mb-6">
        
        {/* Line 1 — Task Text */}
        <input
          className="w-full px-3 py-2 border rounded-lg bg-gray-50"
          placeholder="Add new task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Line 2 — Date, Priority, Add button */}
        <div className="grid grid-cols-[160px_140px_80px] gap-3">
          
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-gray-50 text-sm"
          />

          <select
            className="px-3 py-2 border rounded-lg bg-gray-50 text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="high">High</option>
            <option value="med">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            type="submit"
            className="bg-indigo-600 text-white rounded-lg flex items-center justify-center"
          >
            Add
          </button>

        </div>
      </form>

      {/* Task list */}
      <div className="space-y-3">
        {shown.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks found.</p>
        ) : (
          shown.map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-start p-4 bg-gray-50 border rounded-lg"
            >
              <div className="flex gap-3 items-start">

                <button
                  onClick={() => toggleTask(t.id)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    t.done ? "bg-green-500 text-white" : "bg-white"
                  }`}
                >
                  {t.done && "✓"}
                </button>

                <div>
                  <p className={`font-medium ${t.done ? "line-through text-gray-400" : ""}`}>
                    {t.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t.due && <span>Due: {new Date(t.due).toLocaleDateString()} • </span>}
                    Priority: {PRIORITY_LABELS[t.priority]}
                  </p>
                </div>

              </div>

              <button
                onClick={() => deleteTask(t.id)}
                className="px-3 py-1 text-xs text-red-500 border rounded-md"
              >
                Del
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer filter */}
      <div className="mt-4 text-sm text-gray-600 flex justify-between">
        <span>{tasks.length} total</span>

        <div className="flex gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-2 py-1 rounded ${filter === "all" ? "bg-gray-200" : ""}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-2 py-1 rounded ${filter === "active" ? "bg-gray-200" : ""}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("done")}
            className={`px-2 py-1 rounded ${filter === "done" ? "bg-gray-200" : ""}`}
          >
            Done
          </button>
        </div>
      </div>

    </div>
  );
}
