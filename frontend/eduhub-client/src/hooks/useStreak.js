// src/hooks/useStreak.js
import { useState, useEffect } from "react";

export default function useStreak() {
  const [streak, setStreak] = useState(
    Number(localStorage.getItem("study_streak") || 0)
  );

  const [lastDay, setLastDay] = useState(
    localStorage.getItem("study_last_day") || null
  );

  // Save streak and last day
  useEffect(() => {
    localStorage.setItem("study_streak", streak);
    if (lastDay) localStorage.setItem("study_last_day", lastDay);
  }, [streak, lastDay]);

  // Called when a Pomodoro work session finishes
  function addStudyCheckIn() {
    const today = new Date().toISOString().split("T")[0];

    // First time ever
    if (!lastDay) {
      setLastDay(today);
      setStreak(1);
      return;
    }

    // Already studied today
    if (lastDay === today) return;

    // Calculate yesterday
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    // If yesterday was last study day -> streak++
    if (lastDay === yesterday) {
      setStreak((s) => s + 1);
      setLastDay(today);
    } else {
      // Missed a day → reset streak
      setStreak(1);
      setLastDay(today);
    }
  }

  // Reset manually
  function resetStreak() {
    setStreak(0);
    setLastDay(null);
  }

  return { streak, addStudyCheckIn, resetStreak };
}
