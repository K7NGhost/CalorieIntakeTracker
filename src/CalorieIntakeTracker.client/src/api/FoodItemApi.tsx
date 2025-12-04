import axios from "axios";
import type { FoodItem } from "../Models/FoodItem";

const api = "https://localhost:44369/api/";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

export interface FoodItemCreateDto {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string;
}

export interface FoodItemUpdateDto {
  food?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servingSize?: string;
}

export const getFoodItemById = async (id: number): Promise<FoodItem> => {
  try {
    const response = await axios.get(`${api}FoodItem/${id}`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Food item not found");
    }
    if (error.response) {
      console.error("Server error:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch food item"
      );
    }
    throw new Error("Network error while fetching food item");
  }
};

export const createFoodItem = async (
  mealLogId: number,
  foodData: FoodItemCreateDto
): Promise<FoodItem> => {
  try {
    const response = await axios.post(
      `${api}FoodItem?mealLogId=${mealLogId}`,
      foodData,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`MealLog with ID ${mealLogId} not found`);
    }
    if (error.response) {
      console.error("Server error:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to create food item"
      );
    }
    throw new Error("Network error while creating food item");
  }
};

export const getFoodItemsByMealLog = async (
  mealLogId: number
): Promise<FoodItem[]> => {
  try {
    const response = await axios.get(`${api}FoodItem?mealLogId=${mealLogId}`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Server error:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch food items for meal log"
      );
    }
    throw new Error("Network error while fetching food items");
  }
};

export const updateFoodItem = async (
  id: number,
  foodData: FoodItemUpdateDto
): Promise<FoodItem> => {
  try {
    const response = await axios.put(`${api}FoodItem/${id}`, foodData, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Food item not found");
    }
    if (error.response) {
      console.error("Server error:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to update food item"
      );
    }
    throw new Error("Network error while updating food item");
  }
};

export const deleteFoodItem = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${api}FoodItem/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Food item not found");
    }
    if (error.response) {
      console.error("Server error:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to delete food item"
      );
    }
    throw new Error("Network error while deleting food item");
  }
};
