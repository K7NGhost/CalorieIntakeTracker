import { BarChart3, Flame, Plus, Drumstick, Wheat, Apple } from "lucide-react";
import React, { useEffect, useState } from "react";
import FoodList from "../../Components/FoodList/FoodList";
import { useAuth } from "../../Context/useAuth";
import StatsCard from "../../Components/StatsCard/StatsCard";
import CalorieProgress from "../../Components/CalorieProgress/CalorieProgress";
import BottomNav from "../../Components/BottomNav/BottomNav";
import { getAllMealLogs, type MealLog } from "../../api/MealLogsApi";
import { getCalorieBudget, type CalorieResultDto } from "../../api/profileApi";

type Props = {};

const DashboardPage = (props: Props) => {
  const { user } = useAuth();
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [calorieGoals, setCalorieGoals] = useState<CalorieResultDto | null>(
    null
  );
  const [goalsLoading, setGoalsLoading] = useState(true);

  const recalcMealTotals = (logs: MealLog[]) =>
    logs.map((meal) => {
      if (!meal.foodItems || meal.foodItems.length === 0) {
        return meal;
      }

      const totals = meal.foodItems.reduce(
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
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalCarbs: totals.carbs,
        totalFat: totals.fat,
      };
    });

  // Load meal logs when component mounts
  useEffect(() => {
    if (user?.id) {
      loadMealLogs();
      loadCalorieGoals();
    }
  }, [user]);

  const loadMealLogs = async () => {
    try {
      setLoading(true);
      const logs = await getAllMealLogs(user!.id);
      setMealLogs(recalcMealTotals(logs));
    } catch (error) {
      console.error("Failed to load meal logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCalorieGoals = async () => {
    try {
      setGoalsLoading(true);
      const goals = await getCalorieBudget();
      setCalorieGoals(goals);
    } catch (error) {
      console.error("Failed to load calorie goals:", error);
      // Set default values if profile not found
      setCalorieGoals({
        dailyCalories: 2000,
        proteinGrams: 150,
        carbGrams: 200,
        fatGrams: 65,
      });
    } finally {
      setGoalsLoading(false);
    }
  };

  // Calculate totals from meal logs
  const calculateDailyTotals = () => {
    return mealLogs.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.totalCalories,
        protein: totals.protein + meal.totalProtein,
        carbs: totals.carbs + meal.totalCarbs,
        fat: totals.fat + meal.totalFat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const dailyTotals = calculateDailyTotals();

  if (goalsLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-24 flex items-center justify-center">
        <p className="text-gray-400">Loading your goals...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Calorie Progress */}
          <CalorieProgress
            current={dailyTotals.calories}
            goal={calorieGoals?.dailyCalories || 2000}
          />

          {/* Right Column - Stats and Recent Foods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Macros Stats */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Macronutrients</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatsCard
                  label="Protein"
                  value={dailyTotals.protein}
                  goal={calorieGoals?.proteinGrams || 150}
                  unit="g"
                  icon={Drumstick}
                  color="#f59e0b"
                />
                <StatsCard
                  label="Carbs"
                  value={dailyTotals.carbs}
                  goal={calorieGoals?.carbGrams || 200}
                  unit="g"
                  icon={Wheat}
                  color="#22c55e"
                />
                <StatsCard
                  label="Fat"
                  value={dailyTotals.fat}
                  goal={calorieGoals?.fatGrams || 65}
                  unit="g"
                  icon={Apple}
                  color="#ef4444"
                />
              </div>
            </div>

            {/* Recent Foods List */}
            {loading ? (
              <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                <p className="text-gray-400 text-center">Loading meals...</p>
              </div>
            ) : (
              <FoodList mealLogs={mealLogs} onMealLogsChange={setMealLogs} />
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;
