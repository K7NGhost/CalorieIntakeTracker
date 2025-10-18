import React, { useState } from "react";

type Props = {};

const BarcodeScanPage = (props: Props) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const scannedData = [
    { label: "Name", value: "Greek Yogurt" },
    { label: "Brand", value: "Chobani" },
    { label: "Calories", value: "140 kcal" },
    { label: "Protein", value: "15 g" },
    { label: "Carbs", value: "10 g" },
    { label: "Fat", value: "4 g" },
  ];
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center px-6 py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Scan Barcode</h1>
      <p className="text-gray-400 mb-10 text-center max-w-md">
        Upload or take a picture of a product’s barcode. The app will detect the
        food item and automatically fill in its nutrition data. You can make any
        corrections before saving.
      </p>

      {/* Upload Section */}
      <div className="w-full max-w-lg p-6 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition">
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
              onClick={() => setImagePreview(null)}
            >
              Remove Image
            </button>
          </div>
        )}
      </div>

      {/* Scan Button */}
      <button className="mt-8 bg-orange-500 hover:bg-orange-700 px-8 py-3 rounded-lg font-semibold">
        Scan Barcode
      </button>

      {/* Scanned Data Section */}
      <div className="w-full max-w-lg mt-12 bg-gray-900 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Detected Product Data</h2>

        <div className="flex flex-col gap-4">
          {scannedData.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <label className="text-gray-300 w-1/3">{item.label}</label>
              <input
                type="text"
                defaultValue={item.value}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 w-2/3 text-gray-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanPage;
