import { motion } from 'framer-motion'
import { BarChart3, Flame } from 'lucide-react'
import React from 'react'

type Props = {}

const DashboardPage = (props: Props) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100 px-6 py-10 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-lg"
      >
        <div className="flex items-center justify-center mb-6 space-x-2">
          <Flame className="text-orange-500" size={28} />
          <h1 className="text-3xl font-bold text-white">Your Fitness Dashboard</h1>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Age</label>
            <input
              type="number"
              placeholder="Years"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Weight (kg)</label>
            <input
              type="number"
              placeholder="e.g. 70"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Height (cm)</label>
            <input
              type="number"
              placeholder="e.g. 175"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Activity Level</label>
            <select
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="sedentary">Sedentary (little exercise)</option>
              <option value="light">Light (1-3 days/week)</option>
              <option value="moderate">Moderate (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
              <option value="very">Very Active (physical job)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-300">Goal</label>
            <div className="flex gap-4">
              <div>Goal section</div>
            </div>
          </div>
        </div>

        <button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-semibold transition"
        >
          Calculate
        </button>

        {/* Results */}
        {(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 border-t border-neutral-800 pt-6"
          >
            <div className="flex items-center justify-center mb-4 space-x-2">
              <BarChart3 className="text-orange-500" size={22} />
              <h2 className="text-xl font-semibold text-white">Your Daily Budget</h2>
            </div>

            <div className="text-center space-y-2">
              <p className="text-3xl font-bold text-orange-400">10 kcal</p>
              <p className="text-gray-400 text-sm">per day to 0 weight</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8 text-center">
              <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                <p className="text-gray-400 text-sm">Protein</p>
                <p className="text-2xl font-bold text-orange-400">5 g</p>
              </div>
              <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                <p className="text-gray-400 text-sm">Carbs</p>
                <p className="text-2xl font-bold text-orange-400">5 g</p>
              </div>
              <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                <p className="text-gray-400 text-sm">Fat</p>
                <p className="text-2xl font-bold text-orange-400">5 g</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default DashboardPage