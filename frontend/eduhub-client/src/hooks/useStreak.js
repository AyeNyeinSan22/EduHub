// src/hooks/useStreak.js
import { useEffect, useState } from "react";

export default function useStreak() {
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("study-streak");
    return saved ? Number(saved) : 0;
  });

  const [lastDate, setLastDate] = useState(() => {
    return localStorage.getItem("streak-last-date");
  });

  useEffect(() => {
    const today = new Date().toDateString();

    // First time opening
    if (!lastDate) {
      localStorage.setItem("streak-last-date", today);
      return;
    }

    // If opened again on same day → do nothing
    if (lastDate === today) return;

    // Calculate difference
    const prev = new Date(lastDate);
    const diff = (new Date(today) - prev) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      // Consecutive day → streak +1
      setStreak(prev => {
        const updated = prev + 1;
        localStorage.setItem("study-streak", updated);
        return updated;
      });
    } else {
      // Missed day(s) → reset
      setStreak(1);
      localStorage.setItem("study-streak", 1);
    }

    // Update last date
    setLastDate(today);
    localStorage.setItem("streak-last-date", today);
  }, []);

  return { streak };
}
