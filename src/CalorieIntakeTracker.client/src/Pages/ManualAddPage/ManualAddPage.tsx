import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  createFoodItem,
  getFoodItemsByMealLog,
  type FoodItemCreateDto,
} from "../../api/FoodItemApi";
import { createMealLog, getAllMealLogs } from "../../api/MealLogsApi";
import type { FoodItem } from "../../Models/FoodItem";
import type { MealLog } from "../../api/MealLogsApi";
import BottomNav from "../../Components/BottomNav/BottomNav";
import { useAuth } from "../../Context/useAuth";
import { History, Loader2, Plus, UtensilsCrossed, X } from "lucide-react";
import "./ManualAddPage.css";

type FoodFormState = {
  food: string;
  servingSize: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

const emptyFormState: FoodFormState = {
  food: "",
  servingSize: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
};

const mealTypeOptions = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Post-Workout",
];

const MACRO_CALORIES = {
  protein: 4,
  carbs: 4,
  fat: 9,
} as const;

const ManualAddPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FoodFormState>(emptyFormState);
  const [isCaloriesLocked, setIsCaloriesLocked] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<FoodItemCreateDto[]>([]);
  const [savedFoods, setSavedFoods] = useState<FoodItem[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [selectedMealLogId, setSelectedMealLogId] = useState<number | null>(
    null
  );
  const [mealType, setMealType] = useState(mealTypeOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadFoodsForLog = useCallback(async (mealLogId: number) => {
    setIsLoadingSaved(true);
    try {
      const foods = await getFoodItemsByMealLog(mealLogId);
      setSavedFoods(foods);
    } catch (error: any) {
      setErrorMessage(
        error.message || "Unable to load foods for the selected meal"
      );
    } finally {
      setIsLoadingSaved(false);
    }
  }, []);

  const loadMealLogs = useCallback(
    async (preferredLogId?: number | null) => {
      if (!user?.id) {
        setMealLogs([]);
        setSelectedMealLogId(null);
        setSavedFoods([]);
        setIsLoadingSaved(false);
        return;
      }

      setIsLoadingLogs(true);
      try {
        const logs = await getAllMealLogs(user.id);
        setMealLogs(logs);

        const resolvedPreferred = preferredLogId ?? null;
        const fallbackLogId = logs[0]?.id ?? null;
        const nextLogId = logs.some((log) => log.id === resolvedPreferred)
          ? resolvedPreferred
          : fallbackLogId;
        setSelectedMealLogId(nextLogId);

        if (nextLogId) {
          await loadFoodsForLog(nextLogId);
        } else {
          setSavedFoods([]);
          setIsLoadingSaved(false);
        }
      } catch (error: any) {
        setErrorMessage(error.message || "Unable to load meal history");
        setMealLogs([]);
        setSelectedMealLogId(null);
        setSavedFoods([]);
      } finally {
        setIsLoadingLogs(false);
      }
    },
    [loadFoodsForLog, user?.id]
  );

  useEffect(() => {
    loadMealLogs();
  }, [loadMealLogs]);

  const parseNumber = (value: string) => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const deriveCaloriesFromMacros = (
    state: Pick<FoodFormState, "protein" | "carbs" | "fat">
  ) => {
    const protein = parseNumber(state.protein);
    const carbs = parseNumber(state.carbs);
    const fat = parseNumber(state.fat);
    return (
      protein * MACRO_CALORIES.protein +
      carbs * MACRO_CALORIES.carbs +
      fat * MACRO_CALORIES.fat
    );
  };

  const buildFoodPayload = (state: FoodFormState): FoodItemCreateDto => {
    const protein = parseNumber(state.protein);
    const carbs = parseNumber(state.carbs);
    const fat = parseNumber(state.fat);
    const derivedCalories = Math.round(
      protein * MACRO_CALORIES.protein +
        carbs * MACRO_CALORIES.carbs +
        fat * MACRO_CALORIES.fat
    );
    const manualCalories = parseNumber(state.calories);
    const calories =
      isCaloriesLocked && manualCalories > 0 ? manualCalories : derivedCalories;

    return {
      food: state.food.trim(),
      servingSize: state.servingSize.trim() || undefined,
      calories,
      protein,
      carbs,
      fat,
    };
  };

  const totals = useMemo(
    () =>
      selectedFoods.reduce(
        (acc, item) => ({
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [selectedFoods]
  );

  const filteredSavedFoods = useMemo(() => {
    if (!searchTerm.trim()) {
      return savedFoods;
    }
    return savedFoods.filter((food) =>
      food.food.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [savedFoods, searchTerm]);

  const validateManualEntry = (state: FoodFormState): string => {
    const normalized = buildFoodPayload(state);
    if (!normalized.food) {
      return "Food name is required";
    }
    if (normalized.calories <= 0) {
      return "Calories must be greater than 0";
    }
    if (
      [normalized.protein, normalized.carbs, normalized.fat].some((n) => n < 0)
    ) {
      return "Macros cannot be negative";
    }
    return "";
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "calories") {
      setIsCaloriesLocked(true);
      setFormData((prev) => ({ ...prev, calories: value }));
      return;
    }

    setIsCaloriesLocked(false);
    setFormData((prev) => {
      const next = { ...prev, [name]: value } as FoodFormState;
      const derivedCalories = deriveCaloriesFromMacros(next);
      next.calories = Math.round(derivedCalories).toString();
      return next;
    });
  };

  const handleAddManualFood = () => {
    setSuccessMessage("");
    const validationMessage = validateManualEntry(formData);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }
    const payload = buildFoodPayload(formData);
    setSelectedFoods((prev) => [...prev, payload]);
    setFormData(emptyFormState);
    setIsCaloriesLocked(false);
    setErrorMessage("");
  };

  const handleMealLogSelection = async (mealLogId: number) => {
    setSelectedMealLogId(mealLogId);
    await loadFoodsForLog(mealLogId);
  };

  const handleAddSavedFood = (food: FoodItem) => {
    setErrorMessage("");
    setSuccessMessage("");
    setSelectedFoods((prev) => [
      ...prev,
      {
        food: food.food,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        servingSize: food.servingSize,
      },
    ]);
  };

  const handleRemoveSelectedFood = (index: number) => {
    setSelectedFoods((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveMeal = async () => {
    if (!user?.id) {
      setErrorMessage("You need to be logged in to save foods.");
      return;
    }
    if (selectedFoods.length === 0) {
      setErrorMessage("Add at least one food before saving.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const mealLog = await createMealLog(user.id, {
        mealType,
        totalCalories: Math.round(totals.calories),
        totalProtein: Math.round(totals.protein),
        totalCarbs: Math.round(totals.carbs),
        totalFat: Math.round(totals.fat),
      });

      await Promise.all(
        selectedFoods.map((food) => createFoodItem(mealLog.id, food))
      );

      setSuccessMessage("Meal saved successfully");
      setSelectedFoods([]);
      setFormData(emptyFormState);

      await loadMealLogs(mealLog.id);
    } catch (error: any) {
      setErrorMessage(error.message || "Unable to save meal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="manual-add-page min-h-screen bg-background text-foreground pb-24">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="icon-pill">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
              Manual Entry
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Build your meal from scratch
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Type in a food, set the macros, or pull from your history. We will
            package everything into a single meal log when you are ready.
          </p>
        </div>

        {errorMessage && (
          <div className="alert-block alert-error">
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert-block alert-success">
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="card-glass p-6 space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="food" className="field-label">
                    Food name *
                  </label>
                  <input
                    id="food"
                    name="food"
                    type="text"
                    placeholder="e.g., Greek Yogurt"
                    value={formData.food}
                    onChange={handleManualInputChange}
                    className="field-input"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="servingSize" className="field-label">
                    Serving size (optional)
                  </label>
                  <input
                    id="servingSize"
                    name="servingSize"
                    type="text"
                    placeholder="1 cup"
                    value={formData.servingSize}
                    onChange={handleManualInputChange}
                    className="field-input"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {(
                  [
                    { name: "calories", label: "Calories" },
                    { name: "protein", label: "Protein (g)" },
                    { name: "carbs", label: "Carbs (g)" },
                    { name: "fat", label: "Fat (g)" },
                  ] as Array<{ name: keyof FoodFormState; label: string }>
                ).map((field) => (
                  <div className="flex flex-col gap-2" key={field.name}>
                    <label htmlFor={field.name} className="field-label">
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0"
                      value={formData[field.name] as string}
                      onChange={handleManualInputChange}
                      className="field-input"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Calories auto-update from macros (4/4/9 rule).
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="">
                <label htmlFor="mealType" className="field-label">
                  Meal type
                </label>
                <select
                  id="mealType"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="field-input"
                >
                  {mealTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddManualFood}
                className="primary-btn h-[52px]"
              >
                <Plus className="h-5 w-5" />
                Add food to meal
              </button>
            </div>

            <div className="selected-foods">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                    Current meal
                  </p>
                  <h2 className="text-xl font-semibold">
                    {selectedFoods.length} items
                  </h2>
                </div>
                {selectedFoods.length > 0 && (
                  <div className="flex gap-3 text-sm text-gray-400">
                    <span>{Math.round(totals.calories)} kcal</span>
                    <span>{Math.round(totals.protein)} P</span>
                    <span>{Math.round(totals.carbs)} C</span>
                    <span>{Math.round(totals.fat)} F</span>
                  </div>
                )}
              </div>

              {selectedFoods.length === 0 ? (
                <div className="empty-state">
                  <p className="text-gray-400">
                    Nothing here yet. Add a food manually or pick one from your
                    history.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedFoods.map((food, index) => (
                    <div className="selected-row" key={`${food.food}-${index}`}>
                      <div>
                        <p className="font-medium">{food.food}</p>
                        <p className="text-sm text-gray-400">
                          {food.servingSize || "Custom serving"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span>{Math.round(food.calories)} kcal</span>
                        <span>{Math.round(food.protein)} P</span>
                        <span>{Math.round(food.carbs)} C</span>
                        <span>{Math.round(food.fat)} F</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedFood(index)}
                          className="remove-chip"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <p className="text-sm text-gray-400">
                We will total your macros and write them into a new meal log.
              </p>

              <button
                type="button"
                disabled={selectedFoods.length === 0 || isSubmitting}
                onClick={handleSaveMeal}
                className="primary-btn h-[56px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving meal...
                  </>
                ) : (
                  <>Save meal to log</>
                )}
              </button>
            </div>
          </section>

          <section className="card-glass p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                  History
                </p>
                <h2 className="text-xl font-semibold">
                  Previously added foods
                </h2>
              </div>
              <History className="h-5 w-5 text-gray-500" />
            </div>

            <div className="grid gap-3 sm:grid-cols-[1.2fr_auto]">
              <div className="flex flex-col gap-2">
                <label htmlFor="mealLogSelect" className="field-label">
                  Source meal log
                </label>
                <select
                  id="mealLogSelect"
                  className="field-input"
                  value={selectedMealLogId ?? ""}
                  onChange={(e) => {
                    const nextId = Number(e.target.value);
                    if (!Number.isNaN(nextId)) {
                      handleMealLogSelection(nextId);
                    }
                  }}
                  disabled={isLoadingLogs || mealLogs.length === 0}
                >
                  {mealLogs.length === 0 ? (
                    <option value="" disabled>
                      No meal logs found
                    </option>
                  ) : (
                    mealLogs.map((log) => (
                      <option key={log.id} value={log.id}>
                        {log.mealType} ·{" "}
                        {new Date(log.loggedAt).toLocaleDateString()} ·
                        {Math.round(log.totalCalories)} kcal
                      </option>
                    ))
                  )}
                </select>
              </div>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => loadMealLogs(selectedMealLogId)}
                disabled={isLoadingLogs}
              >
                {isLoadingLogs ? "Refreshing..." : "Refresh logs"}
              </button>
            </div>

            <input
              type="search"
              placeholder="Search saved foods"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="field-input"
              disabled={savedFoods.length === 0}
            />

            <div className="saved-foods-scroll">
              {isLoadingSaved ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : filteredSavedFoods.length === 0 ? (
                <div className="empty-state">
                  <p className="text-gray-400">
                    {selectedMealLogId
                      ? "No foods recorded for this meal log."
                      : "Create a meal log to reuse foods."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSavedFoods.map((food) => (
                    <div key={food.id} className="saved-card">
                      <div>
                        <p className="font-medium">{food.food}</p>
                        <p className="text-sm text-gray-400">
                          {food.servingSize || "Custom serving"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-300">
                        <span>{food.calories} kcal</span>
                        <span>{food.protein} P</span>
                        <span>{food.carbs} C</span>
                        <span>{food.fat} F</span>
                      </div>
                      <button
                        type="button"
                        className="secondary-btn mt-3"
                        onClick={() => handleAddSavedFood(food)}
                      >
                        <Plus className="h-4 w-4" /> Add again
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ManualAddPage;
