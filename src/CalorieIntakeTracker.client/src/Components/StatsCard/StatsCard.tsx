import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  goal?: number;
  unit: string;
  icon: LucideIcon;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  goal,
  unit,
  icon: Icon,
  color = "#f97316",
}) => {
  const percentage = goal ? Math.min((value / goal) * 100, 100) : 0;

  return (
    <div className="bg-neutral-900 border border-neutral-700 hover:border-orange-500 transition-all duration-300 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400 mb-2">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-100">
              {Math.round(value)}
            </span>
            <span className="text-sm text-gray-400">
              / {goal ? Math.round(goal) : "?"}
              {unit}
            </span>
          </div>
        </div>

        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>

      {/* Progress Bar */}
      {goal && (
        <div className="mt-3">
          <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
                backgroundColor: color,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {Math.round(percentage)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
