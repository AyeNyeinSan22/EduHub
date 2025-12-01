// src/pages/StudyArea.jsx
import React from "react";
import { motion } from "framer-motion";

import StreakCard from "../components/StreakCard";
import TasksCard from "../components/TasksCard";
import SubjectOverview from "../components/SubjectsOverviewCard";
import RecentNotesCard from "../components/RecentNotesCard";
import ScheduleCard from "../components/ScheduleCard";
import AiTutorCard from "../components/AITutorCard";
import PomodoroCard from "../components/PomodoroCard";



export default function StudyArea() {
  return (
    <div className="p-6 space-y-10">

    {/* ——————————— TOP ROW ——————————— */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">

        {/* Pomodoro */}
        <div className="bg-white rounded-xl p-6 shadow-md h-full">
            <PomodoroCard />
        </div>

        {/* Today's Tasks */}
        <div className="bg-white rounded-xl p-6 shadow-md h-full col-span-1 lg:col-span-2">
           <TasksCard />
        </div>

       {/* Study Streak*/}
       <div className="bg-white rounded-xl p-6 shadow-md h-full col-span-1">
          <StreakCard />
       </div>
      
    </div>

    {/* ——————————— MIDDLE ROW ——————————— */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

        {/* Recent Notes */}
        <div className="bg-white rounded-xl p-6 shadow-md h-full">
            <RecentNotesCard />
        </div>

        {/* Subjects Overview */}
        <div className="bg-white rounded-xl p-6 shadow-md h-full">
            <SubjectOverview />
        </div>
    </div>


    {/* ——————————— BOTTOM ROW ——————————— */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

        {/* Schedule */}
        <div className="bg-white rounded-xl p-6 shadow-md h-full">
            <ScheduleCard />
        </div>

        {/* AI Study Tutor */}
        <div className="bg-white rounded-xl p-6 shadow-md h-full">
            <AiTutorCard />
        </div>
    </div>

</div>

  );
}
