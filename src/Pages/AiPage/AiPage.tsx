import React, { useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import "./AiPage.css";

const AiPage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nutrientData = [
    { label: "Calories", value: "320 kcal", icon: "🔥" },
    { label: "Protein", value: "15 g", icon: "💪" },
    { label: "Carbs", value: "45 g", icon: "🍚" },
    { label: "Fat", value: "10 g", icon: "🥑" },
  ];

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Image uploaded successfully!");
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
      toast.success("Image uploaded successfully!");
    }
  }, []);

  const analyzeImage = async () => {
    if (!uploadedFile) {
      toast.error("Please upload an image first");
      return;
    }

    setAnalyzing(true);
    try {
      // Here you would call your AI analysis API
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze image");
    } finally {
      setAnalyzing(false);
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
    <div className="ai-page-container min-h-screen text-gray-100 flex flex-col items-center px-6 py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">AI Food Recognition</h1>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        Upload or drop an image of your meal below. Once processed, the AI will
        estimate nutritional values. You can edit any details before saving.
      </p>

      {/* Food Image Display - Prominent at the top */}
      {imagePreview && (
        <div className="w-full max-w-2xl mb-8">
          <div className="food-image-display relative">
            <img
              src={imagePreview}
              alt="Food to analyze"
              className="w-full h-80 object-cover rounded-2xl border-2 border-orange-500/20"
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={clearImage}
                className="remove-button text-white p-2 rounded-full"
                title="Remove image"
              >
                ✕
              </button>
            </div>
            <div className="absolute bottom-4 left-4 status-badge text-white px-3 py-2 rounded-lg">
              <p className="text-sm font-medium">📸 Food Image Ready for Analysis</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      {!imagePreview && (
        <div 
          className="upload-zone w-full max-w-lg p-8 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer"
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
          <div className="text-center">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-gray-400 mb-2 text-lg">Drag & Drop an image here</p>
            <p className="text-gray-500">or click to upload</p>
            <p className="text-gray-600 text-sm mt-2">Supports JPG, PNG, WebP formats</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        {!imagePreview && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="file-button px-8 py-3 rounded-lg font-semibold"
          >
            📁 Choose File
          </button>
        )}
        
        {imagePreview && (
          <>
            <button 
              onClick={analyzeImage}
              disabled={analyzing}
              className="analyze-button px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Analyzing...
                </>
              ) : (
                "🤖 Analyze with AI"
              )}
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="file-button px-6 py-3 rounded-lg font-semibold"
            >
              📁 Change Image
            </button>
          </>
        )}
      </div>

      {/* Nutrient Data Section */}
      <div className="nutrient-card w-full max-w-lg mt-12 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🧮 Detected Nutrients
        </h2>

        <div className="flex flex-col gap-4">
          {nutrientData.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <label className="text-gray-300 w-1/3 font-medium flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </label>
              <input
                type="text"
                defaultValue={item.value}
                className="bg-gray-800/80 border border-gray-600 rounded-lg px-3 py-2 w-2/3 text-gray-100 focus:outline-none focus:border-orange-500 focus:bg-gray-800 transition-all duration-200"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button className="save-button px-6 py-2 rounded-lg font-semibold">
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiPage;
