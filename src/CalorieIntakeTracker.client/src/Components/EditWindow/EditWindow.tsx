import React, { useEffect, useMemo, useState } from "react";
import type { FoodItem } from "../../Models/FoodItem";
import {
  deleteFoodItem,
  updateFoodItem,
  type FoodItemUpdateDto,
} from "../../api/FoodItemApi";
import { Loader2, Trash2, X } from "lucide-react";
import "./EditWindow.css";

type EditWindowProps = {
  isOpen: boolean;
  food: FoodItem | null;
  mealContext?: {
    id: number;
    name: string;
    loggedAt: string;
  };
  onClose: () => void;
  onSaved: (mealId: number, food: FoodItem) => void;
  onDeleted: (mealId: number, foodId: number) => void;
};

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
  calories: "0",
  protein: "0",
  carbs: "0",
  fat: "0",
};

const MACRO_CALORIES = {
  protein: 4,
  carbs: 4,
  fat: 9,
} as const;

const EditWindow: React.FC<EditWindowProps> = ({
  isOpen,
  food,
  mealContext,
  onClose,
  onSaved,
  onDeleted,
}) => {
  const [formData, setFormData] = useState<FoodFormState>(emptyFormState);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCaloriesLocked, setIsCaloriesLocked] = useState(false);

  useEffect(() => {
    if (food) {
      setFormData({
        food: food.food,
        servingSize: food.servingSize ?? "",
        calories: food.calories.toString(),
        protein: food.protein.toString(),
        carbs: food.carbs.toString(),
        fat: food.fat.toString(),
      });
      setIsCaloriesLocked(true);
      setErrorMessage("");
    }
  }, [food]);

  const parsedValues = useMemo(
    () => ({
      calories: Number.parseFloat(formData.calories),
      protein: Number.parseFloat(formData.protein),
      carbs: Number.parseFloat(formData.carbs),
      fat: Number.parseFloat(formData.fat),
    }),
    [formData]
  );

  if (!isOpen || !food || !mealContext) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "calories") {
      setIsCaloriesLocked(true);
      setFormData((prev) => ({ ...prev, calories: value }));
      return;
    }

    setIsCaloriesLocked(false);
    setFormData((prev) => {
      const next = { ...prev, [name]: value } as FoodFormState;
      const protein = Number.parseFloat(next.protein) || 0;
      const carbs = Number.parseFloat(next.carbs) || 0;
      const fat = Number.parseFloat(next.fat) || 0;
      const calories =
        protein * MACRO_CALORIES.protein +
        carbs * MACRO_CALORIES.carbs +
        fat * MACRO_CALORIES.fat;
      next.calories = Math.round(calories).toString();
      return next;
    });
  };

  const validate = () => {
    if (!formData.food.trim()) {
      return "Food name is required";
    }
    if (!Number.isFinite(parsedValues.calories) || parsedValues.calories <= 0) {
      return "Calories must be greater than zero";
    }
    const macroValues = [
      parsedValues.protein,
      parsedValues.carbs,
      parsedValues.fat,
    ];
    if (macroValues.some((value) => Number.isNaN(value) || value < 0)) {
      return "Macros cannot be negative";
    }
    return "";
  };

  const buildPayload = (): FoodItemUpdateDto => {
    const derivedCalories = Math.round(
      (parsedValues.protein || 0) * MACRO_CALORIES.protein +
        (parsedValues.carbs || 0) * MACRO_CALORIES.carbs +
        (parsedValues.fat || 0) * MACRO_CALORIES.fat
    );
    const manualCalories = Number(parsedValues.calories.toFixed(2));
    const calories =
      isCaloriesLocked && manualCalories > 0 ? manualCalories : derivedCalories;

    return {
      food: formData.food.trim(),
      servingSize: formData.servingSize.trim() || undefined,
      calories,
      protein: Number(parsedValues.protein.toFixed(2)),
      carbs: Number(parsedValues.carbs.toFixed(2)),
      fat: Number(parsedValues.fat.toFixed(2)),
    };
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationMessage = validate();
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    try {
      const updatedFood = await updateFoodItem(food.id, buildPayload());
      onSaved(mealContext.id, updatedFood);
      onClose();
    } catch (error: any) {
      setErrorMessage(error.message || "Unable to update food item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this food from the meal?")) {
      return;
    }
    setIsDeleting(true);
    setErrorMessage("");
    try {
      await deleteFoodItem(food.id);
      onDeleted(mealContext.id, food.id);
      onClose();
    } catch (error: any) {
      setErrorMessage(error.message || "Unable to delete food item");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="edit-window-overlay">
      <div className="edit-window-panel">
        <header className="edit-window-header">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Editing
            </p>
            <h3 className="text-2xl font-semibold text-white">
              {formData.food || food.food}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {mealContext.name} ·{" "}
              {new Date(mealContext.loggedAt).toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="close-button"
            aria-label="Close edit window"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {errorMessage && (
          <div className="edit-window-alert" role="alert">
            {errorMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field-block">
              <label className="field-label" htmlFor="foodName">
                Food name
              </label>
              <input
                id="foodName"
                name="food"
                type="text"
                value={formData.food}
                onChange={handleInputChange}
                className="field-input"
                placeholder="Food name"
              />
            </div>
            <div className="field-block">
              <label className="field-label" htmlFor="servingSize">
                Serving size (optional)
              </label>
              <input
                id="servingSize"
                name="servingSize"
                type="text"
                value={formData.servingSize}
                onChange={handleInputChange}
                className="field-input"
                placeholder="1 cup"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                { name: "calories", label: "Calories" },
                { name: "protein", label: "Protein (g)" },
                { name: "carbs", label: "Carbs (g)" },
                { name: "fat", label: "Fat (g)" },
              ] as Array<{ name: keyof FoodFormState; label: string }>
            ).map((field) => (
              <div className="field-block" key={field.name}>
                <label className="field-label" htmlFor={field.name}>
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="field-input"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              className="danger-btn"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Removing
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" /> Delete food
                </>
              )}
            </button>

            <button type="submit" className="primary-btn" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Saving
                </>
              ) : (
                <>Save changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWindow;
