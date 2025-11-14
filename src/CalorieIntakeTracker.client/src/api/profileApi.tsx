import axios from "axios";

const api = "https://localhost:44369/api/profile/";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

// -------------------------------
// DTOs
// -------------------------------

export interface UserProfileDto {
  age: number;
  weightLb: number;
  heightFt: number;
  sex: "Male" | "Female";
  activityLevel: "Sedentary" | "Light" | "Moderate" | "Very" | "Super";
  goal: "Lose" | "Maintain" | "Gain";
}

export interface CalorieResultDto {
  dailyCalories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
}

// -------------------------------
// API Calls
// -------------------------------

/**
 * Save or update the user's profile
 */
export const saveProfile = async (profile: UserProfileDto): Promise<void> => {
  try {
    await axios.post(api + "save", profile, {
      headers: getAuthHeaders(),
    });
  } catch (error: any) {
    if (error.response) {
      console.error("Server error:", error.response.data);
      throw new Error(error.response.data.message || "Failed to save profile");
    }
    throw new Error("Network error while saving profile");
  }
};

/**
 * Get the calculated daily calories & macros
 */
export const getCalorieBudget = async (): Promise<CalorieResultDto> => {
  try {
    const response = await axios.get(api + "calculate", {
      headers: getAuthHeaders(),
      validateStatus: (status) => status < 400,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Server error:", error.response.data);
      throw new Error(
        error.response.data.message ||
          "Failed to calculate daily calorie budget"
      );
    }
    throw new Error("Network error while calculating calorie budget");
  }
};

export const getProfile = async (): Promise<UserProfileDto> => {
  const response = await axios.get<UserProfileDto>(api + "get");
  return response.data;
};
