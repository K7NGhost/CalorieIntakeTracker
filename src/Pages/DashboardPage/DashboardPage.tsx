import { motion } from "framer-motion";
import { BarChart3, Flame } from "lucide-react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import React, { useState } from "react";
import FoodList from "../../Components/FoodList/FoodList";
import { Link } from "react-router-dom";

type Props = {};

const DashboardPage = (props: Props) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center px-6 py-10">
      {/* Greeting */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Kevin Argueta</h1>
        <p className="text-lg text-gray-400">Streak: 7 days 🔥</p>
      </div>

      {/* Radial Progress Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-2">
            <CircularProgressbar
              value={50}
              text={`50%`}
              styles={buildStyles({
                textColor: "#fff",
                pathColor: "#22c55e",
                trailColor: "#1f2937",
              })}
            />
          </div>
          <p className="text-sm text-gray-300">
            Calories
            <br />
            <span className="font-semibold text-white">50/100 kcal</span>
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-2">
            <CircularProgressbar
              value={50}
              text={`${50}%`}
              styles={buildStyles({
                textColor: "#fff",
                pathColor: "#3b82f6",
                trailColor: "#1f2937",
              })}
            />
          </div>
          <p className="text-sm text-gray-300">
            Protein
            <br />
            <span className="font-semibold text-white">50/100g</span>
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-2">
            <CircularProgressbar
              value={50}
              text={`50%`}
              styles={buildStyles({
                textColor: "#fff",
                pathColor: "#f59e0b",
                trailColor: "#1f2937",
              })}
            />
          </div>
          <p className="text-sm text-gray-300">
            Carbs
            <br />
            <span className="font-semibold text-white">50/100g</span>
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-2">
            <CircularProgressbar
              value={50}
              text={`50%`}
              styles={buildStyles({
                textColor: "#fff",
                pathColor: "#ef4444",
                trailColor: "#1f2937",
              })}
            />
          </div>
          <p className="text-sm text-gray-300">
            Fat
            <br />
            <span className="font-semibold text-white">10/20g</span>
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md text-center shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-2">Daily Summary</h2>
        <p className="text-gray-300 mb-1">Calories Remaining: 100</p>
        <p className="text-gray-300 mb-1">Water Intake: 5 / 8 cups</p>
        <p className="text-gray-300 mb-1">Steps: 6,452</p>
        <p className="text-gray-300">Goal: Maintain Weight</p>
      </div>

      {/* Recently Added Foods */}
      <div className="w-full max-w-md mb-10">
        <FoodList />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6">
        <button
          className="bg-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
          onClick={() => setShowDialog(true)}
        >
          + Add Food
        </button>
        <button className="bg-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-700">
          View Dashboard
        </button>
      </div>

      {/* Add Food Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-80 text-center">
            <h3 className="text-xl font-semibold mb-6 text-gray-100">
              Add Food
            </h3>

            <div className="flex flex-col gap-4">
              <Link
                to="/foodSearch"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-semibold"
              >
                Manually Search for Food
              </Link>
              <Link
                to="/aiScan"
                className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg font-semibold"
              >
                Use AI to Detect Food
              </Link>
              <Link
                to="/barcodeScan"
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-3 rounded-lg font-semibold"
              >
                Scan Barcode
              </Link>
            </div>

            <button
              onClick={() => setShowDialog(false)}
              className="mt-6 text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
