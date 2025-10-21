import axios from "axios";

const api = "https://localhost:44369/api/";

export const recognizeFoodByBarcode = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("imageFile", imageFile);

  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${api}food-recognition/barcode`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return response.data; // { barcode: "012345678905" }
  } catch (error: any) {
    if (error.response) {
      console.error("Server error:", error.response.data);
      throw new Error(error.response.data.error || "Recognition failed");
    }
    throw new Error("Network error while uploading image");
  }
};

export const recognizeFoodByAI = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(`${api}food-recognition/ai`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return response.data; // { name, calories, protein, carbs, fats }
  } catch (error: any) {
    console.error(
      "AI recognition failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.error || "Failed to recognize food.");
  }
};
