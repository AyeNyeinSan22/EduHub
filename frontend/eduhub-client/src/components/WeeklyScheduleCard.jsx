// src/components/WeeklyScheduleCard.jsx
import React, { useEffect, useState } from "react";
import { getSchedule } from "../api/schedule";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyScheduleCard() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getSchedule();
        // getSchedule returns fetch Response if using apiJSON wrapper earlier,
        // but in your project it might already return JSON. Handle both:
        let data;
        if (res.json) {
          data = await res.json();
        } else {
          data = res;
        }
        if (!mounted) return;
        setSchedule(data || []);
      } catch (err) {
        console.error("Failed to load schedule:", err);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  function byDay(i) {
    return schedule.filter(s => Number(s.weekday) === i);
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="font-semibold text-lg mb-4">Weekly Schedule</h3>

      <div className="grid grid-cols-7 gap-4">
        {days.map((d, i) => (
          <div key={d} className="p-3 bg-gray-50 rounded-xl min-h-[80px]">
            <div className="text-xs font-semibold text-gray-600 mb-2">{d}</div>
            <div className="space-y-2">
              {byDay(i).length === 0 ? (
                <div className="text-xs text-gray-400">No class</div>
              ) : (
                byDay(i).map(it => (
                  <div key={it.id} className="p-2 bg-white rounded-md shadow-sm text-xs">
                    <div className="font-medium">{it.title}</div>
                    <div className="text-xs text-gray-500">{it.start_time} · {it.location}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
