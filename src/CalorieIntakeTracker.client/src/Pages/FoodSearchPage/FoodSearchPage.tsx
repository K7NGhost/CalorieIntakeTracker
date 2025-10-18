import React, { useState } from "react";

type Props = {};

const FoodSearchPage = (props: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  const dummyResults = [
    {
      name: "Grilled Chicken Breast",
      calories: 220,
      protein: 35,
      carbs: 0,
      fat: 8,
    },
    { name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 3 },
    { name: "Banana", calories: 90, protein: 1, carbs: 23, fat: 0 },
    { name: "Greek Yogurt", calories: 140, protein: 15, carbs: 10, fat: 4 },
    { name: "Salmon Fillet", calories: 400, protein: 34, carbs: 0, fat: 22 },
  ];

  const results = searchQuery
    ? dummyResults.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : dummyResults;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center px-6 py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Manual Food Search</h1>
      <p className="text-gray-400 mb-10 text-center max-w-md">
        Search for a food item manually. You can review its nutritional data and
        add it to your daily log.
      </p>

      {/* Search Bar */}
      <div className="w-full max-w-lg mb-8">
        <input
          type="text"
          placeholder="Search for food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Search Results */}
      <div className="w-full max-w-lg bg-gray-900 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Results</h2>

        {results.length > 0 ? (
          <ul className="divide-y divide-gray-700">
            {results.map((item, index) => (
              <li
                key={index}
                className="py-3 flex justify-between items-center hover:bg-gray-800 rounded-lg px-3 cursor-pointer transition"
              >
                <div>
                  <p className="font-medium text-gray-100">{item.name}</p>
                  <p className="text-sm text-gray-400">
                    {item.calories} kcal • P:{item.protein}g • C:{item.carbs}g •
                    F:{item.fat}g
                  </p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
                  Add
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default FoodSearchPage;
