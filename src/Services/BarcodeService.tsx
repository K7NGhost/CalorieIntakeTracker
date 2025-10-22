import axios from 'axios';

export interface BarcodeScanResult {
  success: boolean;
  data?: {
    name: string;
    brand: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    barcode?: string;
  };
  error?: string;
}

export class BarcodeService {
  private static readonly API_BASE_URL = '/api';

  /**
   * Scan a barcode from an uploaded image
   */
  static async scanFromImage(file: File): Promise<BarcodeScanResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${this.API_BASE_URL}/ai/recognize`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        const aiData = response.data;
        return {
          success: true,
          data: {
            name: aiData.food || 'Unknown Food',
            brand: aiData.brand || 'Unknown Brand',
            calories: aiData.calories || '0',
            protein: aiData.protein || '0',
            carbs: aiData.carbs || '0',
            fat: aiData.fat || '0',
          }
        };
      }

      return {
        success: false,
        error: 'No data received from API'
      };
    } catch (error) {
      console.error('Error scanning barcode:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scan barcode'
      };
    }
  }

  /**
   * Fetch product information using a barcode number
   */
  static async fetchProductByBarcode(barcode: string): Promise<BarcodeScanResult> {
    try {
      // This would typically call a barcode lookup service or your backend
      // For now, we'll return sample data
      return {
        success: true,
        data: {
          name: 'Sample Product',
          brand: 'Sample Brand',
          calories: '100',
          protein: '10',
          carbs: '15',
          fat: '5',
          barcode: barcode,
        }
      };
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product data'
      };
    }
  }

  /**
   * Save scanned food item to the backend
   */
  static async saveFoodItem(foodData: any): Promise<boolean> {
    try {
      // This would call your food item API endpoint
      // For now, we'll just simulate success
      console.log('Saving food item:', foodData);
      return true;
    } catch (error) {
      console.error('Error saving food item:', error);
      return false;
    }
  }
}
