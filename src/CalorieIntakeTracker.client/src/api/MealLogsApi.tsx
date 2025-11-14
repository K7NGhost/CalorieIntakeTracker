import axios from "axios";
import type { FoodItem } from "../Models/FoodItem";

const api = "https://localhost:44369/api/";

export interface MealLog {
  id: number;
  userId: string;
  mealType: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  loggedAt: string;
  foodItems?: FoodItem[];
}

export interface MealLogCreateDto {
  mealType: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

export const createMealLog = async (
  userId: string,
  mealLogData: MealLogCreateDto
): Promise<MealLog> => {
  try {
    const response = await axios.post(
      `${api}users/${userId}/mealLogs`,
      mealLogData,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Server error:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to create meal log"
      );
    }
    throw new Error("Network error while creating meal log");
  }
};

export const getMealLog = async (
  userId: string,
  mealLogId: number
): Promise<MealLog> => {
  try {
    const response = await axios.get(
      `${api}users/${userId}/mealLogs/${mealLogId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Meal log not found");
    }
    if (error.response) {
      console.error("Server error:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch meal log"
      );
    }
    throw new Error("Network error while fetching meal log");
  }
};

export const getAllMealLogs = async (userId: string): Promise<MealLog[]> => {
  try {
    const response = await axios.get(`${api}users/${userId}/mealLogs`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Server error:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch meal logs"
      );
    }
    throw new Error("Network error while fetching meal logs");
  }
};
