// src/components/SubjectsOverviewCard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SubjectsOverviewCard() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/notes");
      const notes = res.data || [];

      // --- Group notes by subject ---
      const grouped = {};
      notes.forEach(note => {
        const subj = note.subject || "Unknown";
        if (!grouped[subj]) {
          grouped[subj] = { total: 0, completed: 0 };
        }
        grouped[subj].total++;

        // If backend has "completed" flag
        if (note.completed) grouped[subj].completed++;
      });

      // Convert to array
      const subjectList = Object.entries(grouped).map(([name, data]) => ({
        name,
        total: data.total,
        completed: data.completed,
        percent: Math.round((data.completed / data.total) * 100)
      }));

      setSubjects(subjectList);
    } catch (e) {
      console.error("Failed to load subject overview", e);
    }
    setLoading(false);
  }

  if (loading) return <div className="p-4">Loading…</div>;

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Subjects Overview</h2>

      <div className="space-y-4">
        {subjects.map((subj, idx) => (
          <div key={idx} className="bg-gray-50 rounded-xl p-4 shadow-sm">

            {/* Subject Title */}
            <div className="flex justify-between">
              <span className="text-md font-bold">{subj.name}</span>
              <span className="text-sm text-gray-500">
                {subj.completed}/{subj.total} completed
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-2 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${subj.percent}%` }}
              ></div>
            </div>

            <div className="text-sm text-gray-500 mt-1">
              {subj.percent}% done
            </div>
          </div>
        ))}

        {subjects.length === 0 && (
          <p className="text-gray-500 text-center py-6">
            No subjects yet. Add notes to begin!
          </p>
        )}
      </div>
    </div>
  );
}
