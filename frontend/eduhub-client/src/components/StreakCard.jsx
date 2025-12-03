// src/components/StreakCard.jsx
import React, { useEffect } from "react";
import useStreak from "../hooks/useStreak";
import confetti from "canvas-confetti";

export default function StreakCard() {
  const { streak } = useStreak();

  function getMessage() {
    if (streak === 0) return "Let's begin your journey! 💪";
    if (streak < 3) return "Nice start! Keep going!";
    if (streak < 7) return "Amazing consistency 🔥";
    if (streak < 15) return "You're unstoppable 🚀";
    if (streak < 30) return "Elite discipline 🧠";
    return "Master level 🌟";
  }

  // Trigger celebration only ONCE
  useEffect(() => {
    if ([3, 7, 30].includes(streak)) {
      confetti({ particleCount: 150, spread: 70 });
    }
  }, [streak]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md h-full">
      <h2 className="text-lg font-semibold mb-2">Study Streak</h2>

      <div className="text-3xl font-bold text-purple-600">
        {streak}-day streak
      </div>

      <p className="text-gray-600 mt-1">{getMessage()}</p>

      <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500"
          style={{ width: `${Math.min(streak * 5, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
