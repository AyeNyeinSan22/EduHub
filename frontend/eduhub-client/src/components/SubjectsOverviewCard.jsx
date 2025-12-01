// src/components/SubjectsOverviewCard.jsx
import React from "react";

const subjects = [
  { id: 1, name: "Mathematics", pct: 75 },
  { id: 2, name: "Chemistry", pct: 55 },
  { id: 3, name: "Computer Engineering", pct: 80 },
];

export default function SubjectsOverviewCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="font-semibold text-lg mb-4">Subjects Overview</h3>

      <div className="space-y-4">
        {subjects.map(s => (
          <div key={s.id}>
            <div className="flex justify-between mb-1">
              <div className="text-sm font-medium">{s.name}</div>
              <div className="text-sm text-gray-500">{s.pct}%</div>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div className="h-3 rounded-full bg-green-500" style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
