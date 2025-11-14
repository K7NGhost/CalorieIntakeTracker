import React, { useState } from "react";
import { recognizeFoodByAI } from "../../Services/FoodRecognitionService";
import { createFoodItem } from "../../api/FoodItemApi";
import { ClipLoader } from "react-spinners";
import BottomNav from "../../Components/BottomNav/BottomNav";
import { useAuth } from "../../Context/useAuth";
import { Trash2, Plus } from "lucide-react";
import { createMealLog } from "../../api/MealLogsApi";

type Props = {};

type NutrientResult = {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

type FoodInMeal = {
  id: string; // temporary ID for UI
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: string;
};

const AiPage = (props: Props) => {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [foodData, setFoodData] = useState<NutrientResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // List of foods to be saved as a meal
  const [mealFoods, setMealFoods] = useState<FoodInMeal[]>([]);
  const [mealType, setMealType] = useState<string>("Snack");

  // Handle image upload / preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFoodData(null);
    setError(null);
    setSuccessMessage(null);
  };

  // Handle AI scan
  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setFoodData(null);
    setSuccessMessage(null);

    try {
      const result = await recognizeFoodByAI(selectedFile);
      setFoodData(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  // Add scanned food to meal list
  const handleAddToMeal = () => {
    if (!foodData) return;

    const newFood: FoodInMeal = {
      id: crypto.randomUUID(),
      food: foodData.food,
      calories: foodData.calories,
      protein: foodData.protein,
      carbs: foodData.carbs,
      fats: foodData.fats,
      servingSize: "1 serving",
    };

    setMealFoods([...mealFoods, newFood]);
    setFoodData(null);
    setImagePreview(null);
    setSelectedFile(null);
    setSuccessMessage(`${newFood.food} added to meal!`);
  };

  // Update a food item in the meal list
  const handleUpdateFood = (
    id: string,
    field: keyof FoodInMeal,
    value: string | number
  ) => {
    setMealFoods(
      mealFoods.map((food) =>
        food.id === id ? { ...food, [field]: value } : food
      )
    );
  };

  // Remove a food from the meal list
  const handleRemoveFood = (id: string) => {
    setMealFoods(mealFoods.filter((food) => food.id !== id));
  };

  // Calculate total nutrition for the meal
  const calculateTotals = () => {
    return mealFoods.reduce(
      (totals, food) => ({
        calories: totals.calories + Number(food.calories),
        protein: totals.protein + Number(food.protein),
        carbs: totals.carbs + Number(food.carbs),
        fats: totals.fats + Number(food.fats),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  // Save the entire meal
  const handleSaveMeal = async () => {
    if (!user?.id) {
      setError("You must be logged in to save meals.");
      return;
    }

    if (mealFoods.length === 0) {
      setError("Please add at least one food item to the meal.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const totals = calculateTotals();

      // Create the meal log
      const mealLog = await createMealLog(user.id, {
        mealType,
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalCarbs: totals.carbs,
        totalFat: totals.fats,
      });

      // Add each food item to the meal log
      for (const food of mealFoods) {
        await createFoodItem(mealLog.id, {
          food: food.food,
          calories: Number(food.calories),
          protein: Number(food.protein),
          carbs: Number(food.carbs),
          fat: Number(food.fats),
          servingSize: food.servingSize,
        });
      }

      setSuccessMessage(`${mealType} saved successfully!`);
      setMealFoods([]);
      setMealType("Snack");
    } catch (err: any) {
      setError(err.message || "Failed to save meal.");
    } finally {
      setSaving(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center px-6 py-10 pb-24">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">AI Food Recognition</h1>
      <p className="text-gray-400 mb-10 text-center max-w-md">
        Upload an image, scan with AI, and add foods to your meal before saving.
      </p>

      {/* Upload Section */}
      <label
        htmlFor="file-upload"
        className="w-full max-w-lg p-6 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition"
      >
        {!imagePreview ? (
          <div className="text-center">
            <p className="text-gray-400 mb-2">📸 Drag & Drop an image here</p>
            <p className="text-gray-500">or click to upload</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-64 h-64 object-cover rounded-lg shadow-lg"
            />
            <button
              type="button"
              className="text-sm text-red-400 hover:text-red-300"
              onClick={(e) => {
                e.preventDefault();
                setImagePreview(null);
                setSelectedFile(null);
              }}
            >
              Remove Image
            </button>
          </div>
        )}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className={`mt-8 px-8 py-3 rounded-lg font-semibold transition ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-700"
        }`}
      >
        {loading ? "Analyzing..." : "Analyze with AI"}
      </button>

      {/* Success/Error Messages */}
      {successMessage && (
        <p className="mt-4 text-green-400">{successMessage}</p>
      )}
      {error && <p className="mt-4 text-red-400">{error}</p>}

      {/* Result Section (Single Food) */}
      {foodData && (
        <div className="w-full max-w-lg mt-12 bg-gray-900 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {foodData.food} — Estimated Nutrients
          </h2>

          <div className="flex flex-col gap-4 w-full">
            <NutrientRow label="Calories" value={`${foodData.calories} kcal`} />
            <NutrientRow label="Protein" value={`${foodData.protein} g`} />
            <NutrientRow label="Carbs" value={`${foodData.carbs} g`} />
            <NutrientRow label="Fats" value={`${foodData.fats} g`} />
          </div>

          <div className="flex justify-end mt-6 w-full">
            <button
              onClick={handleAddToMeal}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Add to Meal
            </button>
          </div>
        </div>
      )}

      {/* Meal Builder Section */}
      {mealFoods.length > 0 && (
        <div className="w-full max-w-2xl mt-12 bg-gray-900 p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Building Your Meal</h2>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-orange-500"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          {/* Food Items List */}
          <div className="space-y-4 mb-6">
            {mealFoods.map((food) => (
              <div
                key={food.id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={food.food}
                    onChange={(e) =>
                      handleUpdateFood(food.id, "food", e.target.value)
                    }
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-lg font-semibold flex-1 mr-2 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={() => handleRemoveFood(food.id)}
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <EditableField
                    label="Calories"
                    value={food.calories}
                    unit="kcal"
                    onChange={(val) =>
                      handleUpdateFood(food.id, "calories", val)
                    }
                  />
                  <EditableField
                    label="Protein"
                    value={food.protein}
                    unit="g"
                    onChange={(val) =>
                      handleUpdateFood(food.id, "protein", val)
                    }
                  />
                  <EditableField
                    label="Carbs"
                    value={food.carbs}
                    unit="g"
                    onChange={(val) => handleUpdateFood(food.id, "carbs", val)}
                  />
                  <EditableField
                    label="Fats"
                    value={food.fats}
                    unit="g"
                    onChange={(val) => handleUpdateFood(food.id, "fats", val)}
                  />
                </div>

                <div className="mt-3">
                  <label className="text-gray-400 text-sm">Serving Size</label>
                  <input
                    type="text"
                    value={food.servingSize}
                    onChange={(e) =>
                      handleUpdateFood(food.id, "servingSize", e.target.value)
                    }
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div className="bg-gray-800 p-4 rounded-lg border-2 border-orange-500 mb-6">
            <h3 className="text-lg font-semibold mb-3">Meal Totals</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-sm">Calories</p>
                <p className="text-xl font-bold text-orange-400">
                  {totals.calories}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Protein</p>
                <p className="text-xl font-bold text-orange-400">
                  {totals.protein}g
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Carbs</p>
                <p className="text-xl font-bold text-orange-400">
                  {totals.carbs}g
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Fats</p>
                <p className="text-xl font-bold text-orange-400">
                  {totals.fats}g
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveMeal}
            disabled={saving}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              saving
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving ? "Saving..." : `Save ${mealType}`}
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="w-full max-w-lg mt-12 bg-gray-900 p-6 rounded-2xl shadow-lg min-h-[200px] flex flex-col items-center justify-center">
          <ClipLoader color="#f97316" size={60} />
          <p className="mt-4 text-gray-400">Analyzing your meal...</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

const NutrientRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between items-center">
    <label className="text-gray-300 w-1/3">{label}</label>
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 w-2/3 text-gray-100">
      {value}
    </div>
  </div>
);

const EditableField = ({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (val: number) => void;
}) => (
  <div>
    <label className="text-gray-400 text-sm">{label}</label>
    <div className="flex items-center gap-2 mt-1">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-orange-500"
      />
      <span className="text-gray-400 text-sm">{unit}</span>
    </div>
  </div>
);

export default AiPage;
