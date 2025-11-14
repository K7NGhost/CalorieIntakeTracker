import { motion } from "framer-motion";
import { BarChart3, Flame, Plus, Drumstick, Wheat, Apple } from "lucide-react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import React, { useState } from "react";
import FoodList from "../../Components/FoodList/FoodList";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import StatsCard from "../../Components/StatsCard/StatsCard";
import CalorieProgress from "../../Components/CalorieProgress/CalorieProgress";
import BottomNav from "../../Components/BottomNav/BottomNav";

type Props = {};

const DashboardPage = (props: Props) => {
  const { user } = useAuth();

  // placeholder data
  const calorieData = { current: 1200, goal: 2000 };
  const macros = { protein: 90, carbs: 200, fat: 60 };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Calorie Progress */}
          <CalorieProgress current={1200} goal={2000} />

          {/* Right Column - Stats and Recent Foods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Macros Stats */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Macronutrients</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatsCard
                  label="Protein"
                  value={90}
                  unit="g"
                  icon={Drumstick}
                  color="#f59e0b"
                />
                <StatsCard
                  label="Carbs"
                  value={180}
                  unit="g"
                  icon={Wheat}
                  color="#22c55e"
                />
                <StatsCard
                  label="Fat"
                  value={60}
                  unit="g"
                  icon={Apple}
                  color="#ef4444"
                />
              </div>
            </div>

            {/* Recent Foods List (Placeholder for RecentFoodsList) */}
            <FoodList
              foods={[
                {
                  id: "1",
                  name: "Grilled Chicken",
                  calories: 320,
                  time: "12:30 PM",
                  category: "Lunch",
                },
                {
                  id: "2",
                  name: "Oatmeal",
                  calories: 180,
                  time: "8:00 AM",
                  category: "Breakfast",
                },
                {
                  id: "3",
                  name: "Apple",
                  calories: 95,
                  time: "2:15 PM",
                  category: "Snack",
                },
              ]}
            />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;
