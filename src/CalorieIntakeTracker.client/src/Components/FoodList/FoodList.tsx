import React from "react";
import { Utensils, Clock } from "lucide-react";

interface Food {
  id: string;
  name: string;
  calories: number;
  time: string;
  category: string;
}

interface FoodListProps {
  foods?: Food[];
}

const FoodList: React.FC<FoodListProps> = ({ foods = [] }) => {
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-100">Recent Foods</h2>
      </div>

      {/* Food Items */}
      <div className="space-y-3">
        {foods.length > 0 ? (
          foods.map((food) => (
            <div
              key={food.id}
              className="flex items-center justify-between p-4 rounded-lg bg-neutral-800 hover:bg-gray-750 transition-all duration-200 group"
            >
              {/* Left section */}
              <div className="flex-1">
                <h4 className="font-medium text-gray-100 group-hover:text-orange-400 transition-colors">
                  {food.name}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {food.time}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span>{food.category}</span>
                </div>
              </div>

              {/* Right section */}
              <div className="text-right">
                <div className="text-lg font-bold text-orange-500">
                  {food.calories}
                </div>
                <div className="text-xs text-gray-400">cal</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No foods logged yet.</p>
        )}
      </div>
    </div>
  );
};

export default FoodList;
