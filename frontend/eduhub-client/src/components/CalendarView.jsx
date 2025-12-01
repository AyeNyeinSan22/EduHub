import React, { useState, useMemo, useEffect } from "react";
import { getSchedule } from "../api/schedule";

/**
 * Simple month calendar that maps classes into weekdays.
 * This calendar shows the month grid and highlights days that have classes (weekly repeating).
 */
export default function CalendarView({ className = "" }) {
  const [today] = useState(new Date());
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-11
  const [schedule, setSchedule] = useState([]);

  useEffect(()=> { loadSchedule(); }, []);

  async function loadSchedule() {
    try {
      const res = await getSchedule();
      const data = await res.json();
      setSchedule(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  const firstDay = useMemo(() => new Date(year, month, 1), [year, month]);
  const startWeekday = firstDay.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month+1, 0).getDate();

  // map weekday (Mon=0) to our Schedule weekday (0=Mon)
  function classesOnDate(dateObj) {
    // weekday 0=Sun in JS -> convert to 0=Mon
    const jsWeekday = dateObj.getDay(); // 0=Sun...6=Sat
    const scheduleWeekday = jsWeekday === 0 ? 6 : jsWeekday - 1;
    return schedule.filter(s => Number(s.weekday) === scheduleWeekday);
  }

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y-1);} else setMonth(m=>m-1); }
  function nextMonth() { if (month === 11) { setMonth(0); setYear(y => y+1);} else setMonth(m=>m+1); }

  const cells = [];
  // leading blanks (startWeekday: Sun=0 -> convert to Monday-based)
  // We want Monday-first: calculate blanks = (startWeekday + 6) % 7
  const blanks = (startWeekday + 6) % 7;
  for (let i=0;i<blanks;i++) cells.push(null);

  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(year, month, d));

  // pad end to complete weeks
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className={`bg-white rounded-xl p-4 shadow ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">Calendar</h3>
          <p className="text-xs text-gray-500">Monthly view (weekly repeating classes)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="px-2 py-1 border rounded">◀</button>
          <div className="px-3 py-1 border rounded">{firstDay.toLocaleString('default', { month: 'long' })} {year}</div>
          <button onClick={nextMonth} className="px-2 py-1 border rounded">▶</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
          <div key={d} className="text-center font-medium">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mt-2">
        {cells.map((cell, idx) => {
          if (!cell) return <div key={idx} className="p-2 h-20 bg-gray-50 rounded" />;
          const cls = classesOnDate(cell);
          return (
            <div key={idx} className="p-2 h-20 bg-gray-50 rounded flex flex-col">
              <div className="text-sm font-medium">{cell.getDate()}</div>
              <div className="mt-1 flex-1 overflow-auto">
                {cls.slice(0,3).map(c => (
                  <div key={c.id} className="text-[11px] bg-indigo-100 text-indigo-800 rounded px-1 py-0.5 mb-1">
                    {c.title} {c.start_time}
                  </div>
                ))}
                {cls.length > 3 && <div className="text-[11px] text-gray-500">+{cls.length-3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
