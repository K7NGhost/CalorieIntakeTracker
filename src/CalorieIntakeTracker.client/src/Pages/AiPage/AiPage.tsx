import React, { useState } from "react";
import { recognizeFoodByAI } from "../../Services/FoodRecognitionService";
import { ClipLoader } from "react-spinners";
import "./AiPage.css";

type Props = {};

type NutrientResult = {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

const AiPage = (props: Props) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [foodData, setFoodData] = useState<NutrientResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle image upload / preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFoodData(null);
    setError(null);
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

    try {
      const result = await recognizeFoodByAI(selectedFile);
      setFoodData(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-100 flex flex-col items-center px-6 py-10" style={{ backgroundColor: '#262628' }}>
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">AI Food Recognition</h1>
      <p className="text-gray-400 mb-10 text-center max-w-md">
        Upload or drop an image of your meal below. Once processed, the AI will
        estimate nutritional values. You can edit any details before saving.
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

      {/* Error */}
      {error && <p className="mt-4 text-red-400">{error}</p>}

      {/* Result Section */}
      <div className="w-full max-w-lg mt-12 bg-gray-900 p-6 rounded-2xl shadow-lg min-h-[200px] flex flex-col items-center justify-center">
        {loading ? (
          // Show loading spinner when analyzing
          <div className="flex flex-col items-center">
            <ClipLoader color="#f97316" size={60} />
            <p className="mt-4 text-gray-400">Analyzing your meal...</p>
          </div>
        ) : foodData ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {foodData.food} — Estimated Nutrients
            </h2>

            <div className="flex flex-col gap-4 w-full">
              <NutrientRow
                label="Calories"
                value={`${foodData.calories} kcal`}
              />
              <NutrientRow label="Protein" value={`${foodData.protein} g`} />
              <NutrientRow label="Carbs" value={`${foodData.carbs} g`} />
              <NutrientRow label="Fats" value={`${foodData.fats} g`} />
            </div>

            <div className="flex justify-end mt-6 w-full">
              <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold">
                Save Changes
              </button>
            </div>
          </>
        ) : (
          // Default placeholder (before scan)
          <p className="text-gray-500 text-center">
            Upload an image and click{" "}
            <span className="text-orange-400 font-semibold">
              Analyze with AI
            </span>{" "}
            to see nutrition details.
          </p>
        )}
      </div>
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
    <input
      type="text"
      defaultValue={value}
      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 w-2/3 text-gray-100 focus:outline-none focus:border-orange-500"
    />
  </div>
);

export default AiPage;
