import React, { useState, useRef, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import Webcam from "react-webcam";
import { toast } from "react-toastify";
import { BarcodeService } from "../../Services/BarcodeService";
import type { BarcodeScanResult } from "../../Services/BarcodeService";
import "./BarcodeScanPage.css";


interface FoodData {
  name: string;
  brand: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  barcode?: string;
}

const BarcodeScanPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<FoodData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const webcamRef = useRef<Webcam>(null);
  const codeReader = useRef(new BrowserMultiFormatReader());
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const scanFromFile = async () => {
    if (!uploadedFile) {
      toast.error("Please upload an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result: BarcodeScanResult = await BarcodeService.scanFromImage(uploadedFile);

      if (result.success && result.data) {
        setScannedData(result.data);
        toast.success("Barcode scanned successfully!");
      } else {
        setError(result.error || "Failed to scan barcode");
        toast.error(result.error || "Failed to scan barcode");
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      setError("Failed to scan barcode. Please try again.");
      toast.error("Failed to scan barcode");
    } finally {
      setLoading(false);
    }
  };

  const startCameraScan = () => {
    setIsScanning(true);
    setError(null);
  };

  const stopCameraScan = () => {
    setIsScanning(false);
    codeReader.current.reset();
  };

  // Note: onDetected callback would be used when implementing live camera barcode scanning
  // Currently using static camera view for demonstration

  const saveFoodItem = async () => {
    if (!scannedData) return;

    try {
      const success = await BarcodeService.saveFoodItem(scannedData);
      
      if (success) {
        toast.success("Food item saved successfully!");
        // Reset form
        setScannedData(null);
        setImagePreview(null);
        setUploadedFile(null);
      } else {
        toast.error("Failed to save food item");
      }
    } catch (error) {
      toast.error("Failed to save food item");
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="barcode-scanner-container min-h-screen text-gray-100 flex flex-col items-center px-6 py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Scan Barcode</h1>
      <p className="text-gray-400 mb-10 text-center max-w-md">
        Upload an image, use your camera, or scan a barcode to automatically detect
        food items and fill in nutrition data.
      </p>

      {/* Upload Section */}
      <div 
        className="upload-zone w-full max-w-lg p-6 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        {!imagePreview ? (
          <div className="text-center">
            <p className="text-gray-400 mb-2">
              📷 Drag & Drop a barcode image here
            </p>
            <p className="text-gray-500">or click to upload</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <img
              src={imagePreview}
              alt="Barcode Preview"
              className="w-64 h-64 object-cover rounded-lg shadow-lg"
            />
            <button
              className="text-sm text-red-400 hover:text-red-300"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
            >
              Remove Image
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        {!isScanning ? (
          <>
            <button 
              onClick={scanFromFile}
              disabled={!uploadedFile || loading}
              className="scan-button disabled:bg-gray-600 disabled:cursor-not-allowed px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Scanning...
                </>
              ) : (
                "📷 Scan Uploaded Image"
              )}
            </button>
            <button 
              onClick={startCameraScan}
              className="camera-button px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              📹 Use Camera
            </button>
          </>
        ) : (
          <button 
            onClick={stopCameraScan}
            className="stop-button px-8 py-3 rounded-lg font-semibold"
          >
            Stop Camera
          </button>
        )}
      </div>

      {/* Camera Scanner */}
      {isScanning && (
        <div className="w-full max-w-lg mt-8 bg-gray-900 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-center">Camera Scanner</h3>
          <div className="scanner-overlay relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              width="100%"
              height={300}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: "environment"
              }}
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="scan-frame w-48 h-32">
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-400 mt-4">
            Point your camera at a barcode to scan
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message w-full max-w-lg mt-6 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Scanned Data Section */}
      {scannedData && (
        <div className="food-data-card w-full max-w-lg mt-12 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Detected Product Data</h2>

          <div className="flex flex-col gap-4">
            {Object.entries(scannedData).filter(([key]) => key !== 'barcode').map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <label className="text-gray-300 w-1/3 capitalize">{key}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setScannedData(prev => prev ? {...prev, [key]: e.target.value} : null)}
                  className="input-field rounded-lg px-3 py-2 w-2/3 text-gray-100 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button 
              onClick={saveFoodItem}
              className="save-button px-6 py-2 rounded-lg font-semibold"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanPage;
