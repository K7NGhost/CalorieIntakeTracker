import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-container min-h-screen flex flex-col items-center justify-center px-6 py-10">
      {/* 404 Illustration */}
      <div className="error-illustration">
        <div className="error-number">404</div>
        <div className="error-icon">🍽️</div>
      </div>

      {/* Error Message */}
      <div className="error-content text-center">
        <h1 className="error-title mb-4">Oops! Page Not Found</h1>
        <p className="error-description mb-4">
          Looks like this page went on a diet and disappeared! 
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="error-suggestion mb-6">
          Don't worry, let's get you back on track with your calorie tracking journey!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="error-actions flex gap-4">
        <button 
          onClick={handleGoHome}
          className="primary-button"
        >
          🏠 Go Home
        </button>
        <button 
          onClick={handleGoBack}
          className="secondary-button"
        >
          ← Go Back
        </button>
      </div>

      {/* Helpful Links */}
      <div className="helpful-links">
        <p className="links-title mb-4">Quick Links:</p>
        <div className="links-grid">
          <button 
            onClick={() => navigate("/dashboard")}
            className="link-button"
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => navigate("/aiScan")}
            className="link-button"
          >
            🤖 AI Scan
          </button>
          <button 
            onClick={() => navigate("/barcodeScan")}
            className="link-button"
          >
            📷 Barcode Scan
          </button>
          <button 
            onClick={() => navigate("/foodSearch")}
            className="link-button"
          >
            🔍 Food Search
          </button>
        </div>
      </div>

      {/* Fun Fact */}
      <div className="fun-fact">
        <p className="fun-fact-text">
          💡 <strong>Fun Fact:</strong> The average person burns about 100 calories 
          just by walking for 15 minutes!
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
