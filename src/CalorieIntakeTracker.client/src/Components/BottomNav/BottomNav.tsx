import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, BarChart3, Plus } from "lucide-react";

const BottomNav: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#171717] border-t border-[#262626] flex justify-around items-center py-3 z-50">
        {/* Dashboard */}
        <Link
          to="/dashboard"
          className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>

        {/* Add Food Button */}
        <button
          onClick={() => setShowDialog(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg -translate-y-4 transition"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Stats */}
        <Link
          to="/stats"
          className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition"
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs mt-1">Stats</span>
        </Link>
      </footer>

      {/* Add Food Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[60]">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-80 text-center">
            <h3 className="text-xl font-semibold mb-6 text-gray-100">
              Add Food
            </h3>

            <div className="flex flex-col gap-4">
              <Link
                to="/foodSearch"
                onClick={() => setShowDialog(false)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-semibold"
              >
                Manually Search for Food
              </Link>
              <Link
                to="/aiScan"
                onClick={() => setShowDialog(false)}
                className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg font-semibold"
              >
                Use AI to Detect Food
              </Link>
              <Link
                to="/barcodeScan"
                onClick={() => setShowDialog(false)}
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
    </>
  );
};

export default BottomNav;
