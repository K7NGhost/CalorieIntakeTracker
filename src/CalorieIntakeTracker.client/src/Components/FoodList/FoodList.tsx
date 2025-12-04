import { ChevronDown, ChevronUp, Clock, Utensils } from "lucide-react";
import type { MealLog } from "../../api/MealLogsApi";
import type { FoodItem } from "../../Models/FoodItem";
import { useEffect, useState, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import EditWindow from "../EditWindow/EditWindow";

interface FoodListProps {
  mealLogs?: MealLog[];
  onMealLogsChange?: Dispatch<SetStateAction<MealLog[]>>;
}

const FoodList: React.FC<FoodListProps> = ({
  mealLogs = [],
  onMealLogsChange,
}) => {
  const [expandedMeals, setExpandedMeals] = useState<Set<number>>(new Set());
  const [displayedLogs, setDisplayedLogs] = useState<MealLog[]>(mealLogs);
  const [editingState, setEditingState] = useState<{
    mealId: number;
    mealType: string;
    loggedAt: string;
    food: FoodItem;
  } | null>(null);

  useEffect(() => {
    setDisplayedLogs(mealLogs);
  }, [mealLogs]);

  const updateDisplayedLogs = useCallback(
    (updater: (prev: MealLog[]) => MealLog[]) => {
      setDisplayedLogs((prev) => updater(prev));
    },
    []
  );

  useEffect(() => {
    if (onMealLogsChange) {
      onMealLogsChange(displayedLogs);
    }
  }, [displayedLogs, onMealLogsChange]);

  const recalcMeal = (meal: MealLog, items: FoodItem[]) => {
    if (!items || items.length === 0) {
      return {
        ...meal,
        foodItems: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      };
    }

    const totals = items.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      ...meal,
      foodItems: items,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
    };
  };

  const toggleMeal = (mealId: number) => {
    setExpandedMeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(mealId)) {
        newSet.delete(mealId);
      } else {
        newSet.add(mealId);
      }
      return newSet;
    });
  };

  const handleFoodUpdated = (mealId: number, updatedFood: FoodItem) => {
    updateDisplayedLogs((prev) =>
      prev.map((meal) => {
        if (meal.id !== mealId || !meal.foodItems) {
          return meal;
        }
        const items = meal.foodItems.map((item) =>
          item.id === updatedFood.id ? updatedFood : item
        );
        return recalcMeal(meal, items);
      })
    );
  };

  const handleFoodDeleted = (mealId: number, foodId: number) => {
    updateDisplayedLogs((prev) =>
      prev.map((meal) => {
        if (meal.id !== mealId || !meal.foodItems) {
          return meal;
        }
        const items = meal.foodItems.filter((item) => item.id !== foodId);
        return recalcMeal(meal, items);
      })
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const openEdit = (meal: MealLog, food: FoodItem) => {
    setEditingState({
      mealId: meal.id,
      mealType: meal.mealType,
      loggedAt: meal.loggedAt,
      food,
    });
  };

  const closeEdit = () => setEditingState(null);

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-100">Recent Foods</h2>
      </div>

      {/* Meal Logs */}
      <div className="space-y-3">
        {displayedLogs.length > 0 ? (
          displayedLogs.map((meal) => (
            <div
              key={meal.id}
              className="rounded-lg bg-neutral-800 overflow-hidden"
            >
              {/* Meal Header */}
              <div
                onClick={() => toggleMeal(meal.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-750 transition-all duration-200 group"
              >
                {/* Left section */}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-100 group-hover:text-orange-400 transition-colors">
                    {meal.mealType}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(meal.loggedAt)}
                    </span>
                    {meal.foodItems && meal.foodItems.length > 0 && (
                      <>
                        <span className="text-gray-600">•</span>
                        <span>
                          {meal.foodItems.length} item
                          {meal.foodItems.length !== 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-500">
                      {meal.totalCalories}
                    </div>
                    <div className="text-xs text-gray-400">cal</div>
                  </div>
                  {meal.foodItems && meal.foodItems.length > 0 && (
                    <div className="text-gray-400">
                      {expandedMeals.has(meal.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Food Items */}
              {expandedMeals.has(meal.id) &&
                meal.foodItems &&
                meal.foodItems.length > 0 && (
                  <div className="border-t border-neutral-700 bg-neutral-850 p-4 space-y-2">
                    {meal.foodItems.map((food) => (
                      <div
                        key={food.id}
                        className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors"
                      >
                        {/* Food details */}
                        <div className="flex-1 min-w-[180px]">
                          <p className="text-gray-200 font-medium">
                            {food.food}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            {food.servingSize && (
                              <span>{food.servingSize}</span>
                            )}
                            <span>P: {food.protein}g</span>
                            <span>C: {food.carbs}g</span>
                            <span>F: {food.fat}g</span>
                          </div>
                        </div>

                        {/* Food calories */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-base font-semibold text-orange-400">
                              {food.calories}
                            </div>
                            <div className="text-xs text-gray-500">cal</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => openEdit(meal, food)}
                            className="px-3 py-1 rounded-full border border-orange-400/60 text-orange-300 text-xs font-semibold hover:bg-orange-500/10 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Meal Totals Summary */}
                    <div className="mt-4 pt-3 border-t border-neutral-700 grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="text-orange-400 font-semibold">
                          {meal.totalCalories} cal
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Protein</p>
                        <p className="text-gray-300 font-semibold">
                          {meal.totalProtein}g
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Carbs</p>
                        <p className="text-gray-300 font-semibold">
                          {meal.totalCarbs}g
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fat</p>
                        <p className="text-gray-300 font-semibold">
                          {meal.totalFat}g
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No meals logged yet.</p>
        )}
      </div>

      <EditWindow
        isOpen={Boolean(editingState)}
        food={editingState?.food ?? null}
        mealContext={
          editingState
            ? {
                id: editingState.mealId,
                name: editingState.mealType,
                loggedAt: editingState.loggedAt,
              }
            : undefined
        }
        onClose={closeEdit}
        onSaved={handleFoodUpdated}
        onDeleted={handleFoodDeleted}
      />
    </div>
  );
};

export default FoodList;
