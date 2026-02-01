import React, { useState } from "react";
import { fetchPrediction } from "../api.jsx";
import WeatherCard from "./WeatherCard.jsx";
import CropCard from "./CropCard.jsx";
import "./Dashboard.css";

function Dashboard() {
  const [city, setCity] = useState("");
  const [soilData, setSoilData] = useState({
    nitrogen: 40,
    phosphorus: 60,
    potassium: 40,
    ph: 6.5,
    soilType: "loamy",
  });
  const [showSoilForm, setShowSoilForm] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const soilTypes = [
    { value: "loamy", label: "🌍 Loamy (Balanced)" },
    { value: "sandy", label: "🏜️ Sandy (Dry)" },
    { value: "clayey", label: "⛰️ Clayey (Heavy)" },
    { value: "silt", label: "☁️ Silty (Moist)" },
    { value: "peaty", label: "🌿 Peaty (Organic)" },
  ];

  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    const result = await fetchPrediction(city, soilData);
    setLoading(false);

    if (result && result.error) {
      const errorMsg = result.error.toLowerCase();
      if (
        errorMsg.includes("city not found") ||
        errorMsg.includes("not found")
      ) {
        setError(
          `City "${city}" not recognized by weather service. Please try:\n• Using a larger nearby city name\n• Entering the state capital\n• Checking the spelling`,
        );
      } else {
        setError(result.error);
      }
    } else if (result) {
      setData(result);
    } else {
      setError("Failed to fetch prediction");
    }
  };

  const handleSearchAgain = () => {
    setCity("");
    setData(null);
    setError(null);
    setShowSoilForm(false);
    setSoilData({
      nitrogen: 40,
      phosphorus: 60,
      potassium: 40,
      ph: 6.5,
      soilType: "loamy",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !showSoilForm) {
      setShowSoilForm(true);
    }
  };

  const handleSoilChange = (field, value) => {
    setSoilData((prev) => ({
      ...prev,
      [field]: isNaN(value) ? value : parseFloat(value),
    }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use OpenStreetMap Nominatim API for reverse geocoding (free, no API key needed)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
          );

          if (!response.ok) {
            throw new Error("Failed to get location name");
          }

          const locationData = await response.json();

          // Try to get the most specific location first, then fall back to larger areas
          // Priority: neighbourhood/suburb -> village -> town -> city -> county -> state_district
          const cityName =
            locationData.address.neighbourhood ||
            locationData.address.suburb ||
            locationData.address.village ||
            locationData.address.town ||
            locationData.address.city ||
            locationData.address.county ||
            locationData.address.state_district ||
            locationData.address.state ||
            "Unknown";

          // Clean up the city name (remove district suffixes, special characters)
          const cleanCityName = cityName
            .replace(/\s+district$/i, "")
            .replace(/\s+division$/i, "")
            .trim();

          console.log(
            "Detected location:",
            cleanCityName,
            "from",
            locationData.address,
          );
          console.log("Full address data:", locationData.address);

          setCity(cleanCityName);
          setGettingLocation(false);
          // Don't auto-open soil form - let user verify the location first
        } catch (err) {
          setError(
            "Failed to get city name from coordinates. Please enter manually.",
          );
          setGettingLocation(false);
        }
      },
      (err) => {
        setGettingLocation(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              "Location permission denied. Please enable location access.",
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information unavailable.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("An error occurred while getting your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome to SahayaKisan</h1>
        <p className="dashboard-subtitle">
          Get AI-powered crop recommendations and weather predictions
        </p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <label className="search-label">🔍 Search Your Location</label>
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-input-icon">📍</span>
            <input
              type="text"
              placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
              disabled={gettingLocation}
            />
            {city && (
              <button
                type="button"
                className="search-clear-btn"
                aria-label="Clear city"
                onClick={() => {
                  setCity("");
                  setError(null);
                }}
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => {
              if (!city.trim()) {
                setError("Please enter a city name");
                return;
              }
              setShowSoilForm(true);
            }}
            className="search-button"
            disabled={gettingLocation}
          >
            Next
          </button>
          <button
            onClick={getCurrentLocation}
            className="search-button"
            disabled={gettingLocation}
            style={{
              background: gettingLocation ? "#94a3b8" : "#10b981",
              marginLeft: "0.5rem",
            }}
          >
            {gettingLocation ? (
              <>
                <svg
                  className="spinner"
                  viewBox="0 0 24 24"
                  style={{
                    width: "16px",
                    height: "16px",
                    marginRight: "8px",
                    display: "inline-block",
                  }}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.25"
                  />
                  <path
                    fill="currentColor"
                    opacity="0.75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Getting Location...
              </>
            ) : (
              <>📍 Use Current Location</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            whiteSpace: "pre-line",
            background: error.includes("📍 Location detected")
              ? "#dbeafe"
              : "#fee2e2",
            color: error.includes("📍 Location detected")
              ? "#1e40af"
              : "#dc2626",
            borderLeft: error.includes("📍 Location detected")
              ? "4px solid #3b82f6"
              : "4px solid #dc2626",
          }}
        >
          {error}
        </div>
      )}

      {/* Soil Form Section */}
      {showSoilForm && !data && (
        <div className="soil-form-section">
          <div className="soil-form-header">
            <div>
              <h2 className="soil-form-title">🌍 Soil Information</h2>
              <p className="soil-form-subtitle">
                Enter your soil details for accurate crop recommendation
              </p>
            </div>
            <button
              onClick={() => setShowSoilForm(false)}
              className="soil-form-close-btn"
            >
              ✕
            </button>
          </div>

          <div className="soil-inputs-grid">
            {/* Nitrogen */}
            <div className="soil-input-group">
              <label className="soil-input-label">Nitrogen (N) - mg/kg</label>
              <div className="soil-input-wrapper">
                <input
                  type="number"
                  value={soilData.nitrogen}
                  onChange={(e) => handleSoilChange("nitrogen", e.target.value)}
                  className="soil-input"
                  min="0"
                  max="1000"
                />
                <span className="soil-input-icon">🌾</span>
              </div>
              <p className="soil-input-hint">Typical range: 20-100</p>
            </div>

            {/* Phosphorus */}
            <div className="soil-input-group">
              <label className="soil-input-label">Phosphorus (P) - mg/kg</label>
              <div className="soil-input-wrapper">
                <input
                  type="number"
                  value={soilData.phosphorus}
                  onChange={(e) =>
                    handleSoilChange("phosphorus", e.target.value)
                  }
                  className="soil-input"
                  min="0"
                  max="1000"
                />
                <span className="soil-input-icon">🌱</span>
              </div>
              <p className="soil-input-hint">Typical range: 10-50</p>
            </div>

            {/* Potassium */}
            <div className="soil-input-group">
              <label className="soil-input-label">Potassium (K) - mg/kg</label>
              <div className="soil-input-wrapper">
                <input
                  type="number"
                  value={soilData.potassium}
                  onChange={(e) =>
                    handleSoilChange("potassium", e.target.value)
                  }
                  className="soil-input"
                  min="0"
                  max="1000"
                />
                <span className="soil-input-icon">🍃</span>
              </div>
              <p className="soil-input-hint">Typical range: 10-100</p>
            </div>

            {/* pH */}
            <div className="soil-input-group">
              <label className="soil-input-label">Soil pH Level</label>
              <div className="soil-input-wrapper">
                <input
                  type="number"
                  value={soilData.ph}
                  onChange={(e) => handleSoilChange("ph", e.target.value)}
                  className="soil-input"
                  min="0"
                  max="14"
                  step="0.1"
                />
                <span className="soil-input-icon">⚗️</span>
              </div>
              <p className="soil-input-hint">Range: 0-14 (7 is neutral)</p>
            </div>
          </div>

          {/* Soil Type */}
          <div className="soil-type-section">
            <label className="soil-type-label">Soil Type</label>
            <div className="soil-type-grid">
              {soilTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleSoilChange("soilType", type.value)}
                  className={`soil-type-button ${
                    soilData.soilType === type.value ? "active" : ""
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="soil-form-actions">
            <button onClick={() => setShowSoilForm(false)} className="btn-back">
              Back
            </button>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-submit"
            >
              {loading ? (
                <span className="btn-submit-loading">
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Getting Prediction...
                </span>
              ) : (
                "Get Crop Recommendation"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {data && (
        <div className="results-section">
          {/* Search Again Button */}
          <div className="results-header flex justify-center mb-6">
            <button onClick={handleSearchAgain} className="search-again-button">
              <span>🔍</span>
              Search Another City
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-8 border-red-500 text-red-800 p-6 rounded-xl mb-8 shadow-lg animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className="text-4xl">⚠️</div>
                <div>
                  <p className="font-bold text-lg mb-1">Something went wrong</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}
          <WeatherCard weather={data} />
          <CropCard cropData={data} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
