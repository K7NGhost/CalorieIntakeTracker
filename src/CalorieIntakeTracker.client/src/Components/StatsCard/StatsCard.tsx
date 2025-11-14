import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  color = "#f97316", // fallback to orange
}) => {
  return (
    <div className="bg-neutral-900 border border-neutral-700 hover:border-orange-500 transition-all duration-300 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-2">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-100">{value}</span>
            <span className="text-sm text-gray-400">{unit}</span>
          </div>
        </div>

        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
