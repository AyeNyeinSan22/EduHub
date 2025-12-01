import React, { useEffect, useRef, useState } from "react";

export default function PomodoroCard() {
  const [workMin, setWorkMin] = useState(45);
  const [breakMin, setBreakMin] = useState(10);
  const [seconds, setSeconds] = useState(workMin * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [mode, setMode] = useState("focus"); // focus or break
  const intervalRef = useRef(null);

  useEffect(() => {
    setSeconds((mode === "focus" ? workMin : breakMin) * 60);
  }, [mode, workMin, breakMin]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);

          if (mode === "focus") {
            setMode("break");
          } else {
            setMode("focus");
          }

          if (autoStart) {
            setTimeout(() => setIsRunning(true), 300);
          } else {
            setIsRunning(false);
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode, autoStart]);

  const format = () => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setMode("focus");
    setSeconds(workMin * 60);
  };

  const setPreset = (w, b) => {
    setWorkMin(w);
    setBreakMin(b);
    setMode("focus");
    setSeconds(w * 60);
    setIsRunning(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <p className="text-xs text-purple-600 mb-1">Pomodoro Timer</p>

      <h2 className="text-lg font-bold">Focus</h2>
      <p className="text-gray-500 text-sm mb-1">Work session</p>

      {/* TIMER */}
      <div className="text-5xl font-bold mb-4 tracking-tight">
        {format()}
      </div>

      {/* CONTROLS */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={start}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Start
        </button>

        <button
          onClick={pause}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Pause
        </button>

        <button
          onClick={reset}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      {/* PRESETS ROW */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setPreset(25, 5)}
          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg"
        >
          Focus (25/5)
        </button>

        <button
          onClick={() => setPreset(15, 5)}
          className="px-3 py-1 bg-gray-100 rounded-lg"
        >
          Short (15/5)
        </button>

        <button
          onClick={() => setPreset(50, 10)}
          className="px-3 py-1 bg-gray-100 rounded-lg"
        >
          Long (50/10)
        </button>

        <button
          onClick={() => setPreset(45, 10)}
          className="px-3 py-1 bg-gray-100 rounded-lg"
        >
          Power Hour (45/10)
        </button>
      </div>

      {/* WORK + BREAK INPUTS */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="text-sm text-gray-600">Work (min)</label>
          <input
            type="number"
            value={workMin}
            onChange={(e) => setWorkMin(Number(e.target.value))}
            className="w-full p-2 mt-1 border rounded-lg bg-gray-50"
          />
        </div>

        <div className="flex-1">
          <label className="text-sm text-gray-600">Break (min)</label>
          <input
            type="number"
            value={breakMin}
            onChange={(e) => setBreakMin(Number(e.target.value))}
            className="w-full p-2 mt-1 border rounded-lg bg-gray-50"
          />
        </div>
      </div>

      {/* AUTO-START */}
      <div className="flex items-center gap-2 mb-1">
        <input
          type="checkbox"
          checked={autoStart}
          onChange={() => setAutoStart(!autoStart)}
        />
        <span className="text-sm text-gray-700">Auto-start</span>
      </div>

      {/* RECENT SESSIONS */}
      <p className="text-xs text-gray-500 mt-3">Recent Sessions</p>
      <p className="text-xs text-gray-400">No sessions yet</p>
    </div>
  );
}
