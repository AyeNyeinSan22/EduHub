// src/components/ScheduleCard.jsx
import React, { useEffect, useState } from "react";
import { getSchedule, createSchedule, updateSchedule, deleteSchedule,deleteAllSchedule } from "../api/schedule";
import ScheduleUploadModal from "./ScheduleUploadModal";
import EditScheduleModal from "./EditScheduleModal";

function colorForTitle(title) {
  const colors = [
    "bg-red-200 text-red-800",
    "bg-orange-200 text-orange-900",
    "bg-amber-200 text-amber-900",
    "bg-lime-200 text-lime-900",
    "bg-emerald-200 text-emerald-900",
    "bg-cyan-200 text-cyan-900",
    "bg-indigo-200 text-indigo-900",
    "bg-violet-200 text-violet-900",
  ];
  if (!title) return colors[0];
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash << 5) - hash + title.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
}

export default function ScheduleCard() {
  const [schedule, setSchedule] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    loadSchedule();
  }, []);

  async function loadSchedule() {
    try {
      const res = await getSchedule();
      const data = await res.json();
      setSchedule(data || []);
    } catch (e) {
      console.error("Schedule error:", e);
    }
  }

  function classesByDay(dayIndex) {
    return schedule
      .filter((s) => Number(s.weekday) === dayIndex)
      .sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));
  }

  // Called from EditScheduleModal onSave(updated)
  async function saveEdited(updated) {
    try {
      await updateSchedule(updated.id, updated);
      await loadSchedule();
    } catch (e) {
      console.error("Save edited error", e);
    }
  }

  async function createClass(item) {
    try {
      await createSchedule(item);
      await loadSchedule();
    } catch (e) {
      console.error("Create class error", e);
    }
  }

  async function deleteClass(id) {
    if (!confirm("Delete class?")) return;
    try {
      await deleteSchedule(id);
      await loadSchedule();
    } catch (e) {
      console.error("Delete error", e);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border min-h-[380px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-xl">Schedule</h3>

      {/* Button Group */}
      <div className="flex gap-3">
       <button
        onClick={() => setShowUploadModal(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm shadow hover:opacity-90"
       >
      Upload
       </button>

       <button
        onClick={async () => {
          if (confirm("Delete ALL classes?")) {
          await deleteAllSchedule();
          loadSchedule();
        }
        }}
      className="px-4 py-2 bg-red-500 text-white rounded-full text-sm shadow hover:bg-red-600"
       >
        Delete All
      </button>
  </div>
</div>


      <div className="grid grid-cols-7 gap-4 flex-1">
        {days.map((day, di) => (
          <div key={day} className="p-4 bg-gray-50 rounded-xl shadow-sm min-h-[240px] flex flex-col">
            <p className="text-sm font-semibold text-gray-700 mb-3">{day}</p>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {classesByDay(di).length === 0 && <p className="text-xs text-gray-400">No class</p>}

              {classesByDay(di).map((cls) => (
                <div key={cls.id} className={`p-3 rounded-xl shadow flex items-start justify-between text-sm ${colorForTitle(cls.title)}`}>
                  <div>
                    <p className="font-bold text-base leading-tight">{cls.title}</p>
                    <p className="text-xs opacity-80 mt-1">{cls.start_time} • {cls.location}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button onClick={() => { setEditItem(cls); setShowModal(true); }} className="text-xs bg-white/40 px-2 py-1 rounded hover:bg-white/60">Edit</button>
                    <button onClick={() => deleteClass(cls.id)} className="text-xs bg-white/40 px-2 py-1 rounded hover:bg-white/60">Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <EditScheduleModal
        open={showModal}
        item={editItem}
        onClose={() => { setShowModal(false); setEditItem(null); }}
        onSave={saveEdited}
      />

      <ScheduleUploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploaded={loadSchedule}
      />
    </div>
  );
}
