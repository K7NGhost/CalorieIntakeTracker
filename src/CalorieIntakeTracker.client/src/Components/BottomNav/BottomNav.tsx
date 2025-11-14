import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, BarChart3, Plus, Wrench } from "lucide-react";

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

        {/* Setup */}
        <Link
          to="/setup"
          className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition"
        >
          <Wrench className="w-6 h-6"></Wrench>
          <span className="text-xs mt-1">Setup</span>
        </Link>
      </footer>

      {/* Add Food Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[60]">
          <div className="bg-neutral-900 border border-neutral-700 p-8 rounded-xl shadow-2xl w-80 max-w-[90%]">
            <h3 className="text-2xl font-bold mb-6 text-gray-100">Add Food</h3>

            <div className="flex flex-col gap-3">
              <Link
                to="/foodSearch"
                onClick={() => setShowDialog(false)}
                className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-orange-500 px-4 py-3 rounded-lg font-semibold text-gray-100 transition-all duration-300"
              >
                Manually Search for Food
              </Link>
              <Link
                to="/aiScan"
                onClick={() => setShowDialog(false)}
                className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-orange-500 px-4 py-3 rounded-lg font-semibold text-gray-100 transition-all duration-300"
              >
                Use AI to Detect Food
              </Link>
              <Link
                to="/barcodeScan"
                onClick={() => setShowDialog(false)}
                className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-orange-500 px-4 py-3 rounded-lg font-semibold text-gray-100 transition-all duration-300"
              >
                Scan Barcode
              </Link>
            </div>

            <button
              onClick={() => setShowDialog(false)}
              className="mt-6 w-full text-gray-400 hover:text-gray-200 py-2 transition-colors"
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
