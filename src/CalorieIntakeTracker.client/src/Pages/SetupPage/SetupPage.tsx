import React, { useEffect, useState } from "react";
import {
  saveProfile,
  getCalorieBudget,
  type UserProfileDto,
  type CalorieResultDto,
  getProfile,
} from "../../api/profileApi";
import BottomNav from "../../Components/BottomNav/BottomNav";
import { Drumstick, Wheat, Apple, User, Target, Activity } from "lucide-react";
import StatsCard from "../../Components/StatsCard/StatsCard";

type Props = {};

const SetupPage = (props: Props) => {
  const [formData, setFormData] = useState<UserProfileDto>({
    age: 0,
    weightLb: 0,
    heightFt: 0,
    sex: "Male",
    activityLevel: "Sedentary",
    goal: "Maintain",
  });

  const [result, setResult] = useState<CalorieResultDto | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserProfileDto, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load existing profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const [profile, budget] = await Promise.all([
          getProfile(),
          getCalorieBudget(),
        ]);

        setFormData(profile);
        setResult(budget);
      } catch (error: any) {
        console.log("No existing profile found");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfileDto, string>> = {};

    if (!formData.age || formData.age < 10 || formData.age > 120) {
      newErrors.age = "Age must be between 13 and 120";
    }
    if (
      !formData.weightLb ||
      formData.weightLb < 45 ||
      formData.weightLb > 800
    ) {
      newErrors.weightLb = "Weight must be between 66 and 660 lbs";
    }
    if (
      !formData.heightFt ||
      formData.heightFt < 3.3 ||
      formData.heightFt > 8.2
    ) {
      newErrors.heightFt = "Height must be between 3.3 and 8.2 ft";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "age" || name === "weightLb" || name === "heightFt"
          ? parseFloat(value) || 0
          : value,
    }));
    // Clear error for this field
    if (errors[name as keyof UserProfileDto]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      setErrorMessage("Please correct the errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      await saveProfile(formData);
      const budget = await getCalorieBudget();
      setResult(budget);
      setSuccessMessage("Profile saved successfully!");
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to save profile");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoadingProfile ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <svg
              className="animate-spin h-12 w-12 text-primary"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Setup Your Profile</h1>
              <p className="text-gray-400">
                Tell us about yourself to calculate your personalized calorie
                and macro goals
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column - Form */}
              <div className="lg:col-span-2">
                <form
                  onSubmit={handleSubmit}
                  className="bg-neutral-900 border border-neutral-700 rounded-xl p-6"
                >
                  <div className="grid gap-6 sm:grid-cols-2 mb-6">
                    {/* Age */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="age"
                        className="text-sm font-medium text-gray-300 mb-2"
                      >
                        Age *
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age || ""}
                        onChange={handleInputChange}
                        className={`bg-neutral-800 border ${
                          errors.age ? "border-red-500" : "border-neutral-700"
                        } rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                        placeholder="Enter your age"
                      />
                      {errors.age && (
                        <span className="text-red-500 text-sm mt-1">
                          {errors.age}
                        </span>
                      )}
                    </div>

                    {/* Weight */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="weightLb"
                        className="text-sm font-medium text-gray-300 mb-2"
                      >
                        Weight (lbs) *
                      </label>
                      <input
                        type="number"
                        id="weightLb"
                        name="weightLb"
                        value={formData.weightLb || ""}
                        onChange={handleInputChange}
                        step="0.1"
                        className={`bg-neutral-800 border ${
                          errors.weightLb
                            ? "border-red-500"
                            : "border-neutral-700"
                        } rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                        placeholder="Enter your weight"
                      />
                      {errors.weightLb && (
                        <span className="text-red-500 text-sm mt-1">
                          {errors.weightLb}
                        </span>
                      )}
                    </div>

                    {/* Height */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="heightFt"
                        className="text-sm font-medium text-gray-300 mb-2"
                      >
                        Height (ft) *
                      </label>
                      <input
                        type="number"
                        id="heightFt"
                        name="heightFt"
                        value={formData.heightFt || ""}
                        onChange={handleInputChange}
                        step="0.1"
                        className={`bg-neutral-800 border ${
                          errors.heightFt
                            ? "border-red-500"
                            : "border-neutral-700"
                        } rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                        placeholder="Enter your height (e.g., 5.8)"
                      />
                      {errors.heightFt && (
                        <span className="text-red-500 text-sm mt-1">
                          {errors.heightFt}
                        </span>
                      )}
                    </div>

                    {/* Sex */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="sex"
                        className="text-sm font-medium text-gray-300 mb-2"
                      >
                        Sex *
                      </label>
                      <select
                        id="sex"
                        name="sex"
                        value={formData.sex}
                        onChange={handleInputChange}
                        className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    {/* Activity Level */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="activityLevel"
                        className="text-sm font-medium text-gray-300 mb-2"
                      >
                        Activity Level *
                      </label>
                      <select
                        id="activityLevel"
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleInputChange}
                        className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      >
                        <option value="Sedentary">
                          Sedentary (little/no exercise)
                        </option>
                        <option value="Light">Light (1-3 days/week)</option>
                        <option value="Moderate">
                          Moderate (3-5 days/week)
                        </option>
                        <option value="Very">
                          Very Active (6-7 days/week)
                        </option>
                        <option value="Super">Super Active (athlete)</option>
                      </select>
                    </div>

                    {/* Goal */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="goal"
                        className="text-sm font-medium text-gray-300 mb-2"
                      >
                        Goal *
                      </label>
                      <select
                        id="goal"
                        name="goal"
                        value={formData.goal}
                        onChange={handleInputChange}
                        className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      >
                        <option value="Lose">Lose Weight</option>
                        <option value="Maintain">Maintain Weight</option>
                        <option value="Gain">Gain Weight</option>
                      </select>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      <span className="font-medium">{errorMessage}</span>
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                      <span className="text-xl">✓</span>
                      <span className="font-medium">{successMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-orange-500 disabled:hover:to-orange-600 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Calculating...
                      </span>
                    ) : (
                      "Calculate My Goals"
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column - Results */}
              <div className="space-y-6">
                {result ? (
                  <>
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Your Daily Goals
                      </h2>
                      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 text-center">
                        <div className="text-primary text-5xl font-bold mb-2">
                          {Math.round(result.dailyCalories)}
                        </div>
                        <div className="text-gray-400 text-sm">
                          calories/day
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Macronutrients
                      </h2>
                      <div className="space-y-4">
                        <StatsCard
                          label="Protein"
                          value={Math.round(result.proteinGrams)}
                          unit="g"
                          icon={Drumstick}
                          color="#f59e0b"
                        />
                        <StatsCard
                          label="Carbs"
                          value={Math.round(result.carbGrams)}
                          unit="g"
                          icon={Wheat}
                          color="#22c55e"
                        />
                        <StatsCard
                          label="Fat"
                          value={Math.round(result.fatGrams)}
                          unit="g"
                          icon={Apple}
                          color="#ef4444"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                    <p className="text-gray-400 text-center">
                      Fill out your profile to see your personalized goals
                    </p>
                  </div>
                )}
              </div>
            </div>{" "}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default SetupPage;
