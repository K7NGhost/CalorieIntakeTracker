import React from "react";

type Props = {};

const FoodList = (props: Props) => {
  const recentFoods = [
    {
      name: "Grilled Chicken Breast",
      calories: 220,
      protein: 35,
      carbs: 0,
      fat: 8,
    },
    {
      name: "Oatmeal with Banana",
      calories: 320,
      protein: 9,
      carbs: 55,
      fat: 6,
    },
    { name: "Greek Yogurt", calories: 140, protein: 15, carbs: 10, fat: 4 },
    { name: "Almonds (1 oz)", calories: 165, protein: 6, carbs: 5, fat: 14 },
    {
      name: "Salmon with Rice",
      calories: 410,
      protein: 38,
      carbs: 25,
      fat: 14,
    },
  ];
  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">
        Recently Added Foods
      </h2>

      <ul className="divide-y divide-gray-700">
        {recentFoods.map((food, index) => (
          <li
            key={index}
            className="py-3 flex justify-between items-center hover:bg-gray-800 rounded-lg px-3 cursor-pointer transition"
          >
            <div>
              <p className="font-medium text-gray-100">{food.name}</p>
              <p className="text-sm text-gray-400">
                {food.calories} kcal • P:{food.protein}g • C:{food.carbs}g • F:
                {food.fat}g
              </p>
            </div>
            <span className="text-gray-400 text-lg">›</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodList;
