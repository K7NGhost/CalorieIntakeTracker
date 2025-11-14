import React from "react";

interface CalorieProgressProps {
  current: number;
  goal: number;
}

const CalorieProgress: React.FC<CalorieProgressProps> = ({ current, goal }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(goal - current, 0);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="bg-[#171717] border border-[#262626] rounded-xl p-6 flex flex-col items-center text-gray-100 shadow-sm">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-4 text-gray-100">
        Today's Calories
      </h2>

      {/* Progress Circle */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 200 200"
        >
          {/* Background Circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#2d2d2d"
            strokeWidth="16"
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#f97316"
            strokeWidth="16"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter: "drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))",
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold">{current}</div>
          <div className="text-sm text-gray-400">of {goal} cal</div>
        </div>
      </div>

      {/* Remaining Text */}
      <div className="mt-4 text-center">
        <p className="text-gray-400">
          {remaining > 0 ? `${remaining} calories remaining` : "Goal reached!"}
        </p>
      </div>
    </div>
  );
};

export default CalorieProgress;
