import React from "react";
import "./CropCard.css";

function CropCard({ cropData }) {
  if (!cropData) return null;

  const getCropEmoji = (crop) => {
    const emojiMap = {
      rice: "🌾",
      maize: "🌽",
      chickpea: "🫘",
      banana: "🍌",
      mango: "🥭",
      grapes: "🍇",
      watermelon: "🍉",
      apple: "🍎",
      orange: "🍊",
      papaya: "🍈",
      coconut: "🥥",
      cotton: "🌸",
      coffee: "☕",
      pomegranate: "🫒",
    };
    return emojiMap[crop.toLowerCase()] || "🌱";
  };

  return (
    <div className="crop-card">
      <div className="crop-header">
        <div className="crop-icon-box">
          <span className="crop-emoji">🌱</span>
        </div>
        <div>
          <h2 className="crop-title">Crop Recommendation</h2>
          <p className="crop-subtitle">AI-Powered Insights</p>
        </div>
      </div>

      <div className="recommendation-box">
        <div className="recommendation-content">
          <div className="recommendation-emoji">
            {getCropEmoji(cropData.recommended_crop)}
          </div>
          <div className="recommendation-label">Best Crop for Your Region</div>
          <div className="recommendation-crop">{cropData.recommended_crop}</div>
          <div className="recommendation-info">
            <p>
              🎯 Based on current weather conditions in{" "}
              <strong>{cropData.city}</strong>
            </p>
          </div>
        </div>
      </div>

      {cropData.tips && cropData.tips.length > 0 && (
        <div className="tips-section">
          <div className="tips-header">
            <span className="tips-icon">💡</span>
            <h3 className="tips-title">Smart Farming Tips</h3>
          </div>
          <ul className="tips-list">
            {cropData.tips.map((tip, index) => (
              <li key={index} className="tip-item">
                <span className="tip-checkmark">✓</span>
                <span className="tip-text">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="crop-metrics">
        <div className="metric-item metric-item-temperature">
          <div className="metric-item-icon">🌡️</div>
          <div className="metric-item-label">Temperature</div>
          <div className="metric-item-value">{cropData.temperature}°C</div>
        </div>
        <div className="metric-item metric-item-humidity">
          <div className="metric-item-icon">💧</div>
          <div className="metric-item-label">Humidity</div>
          <div className="metric-item-value">{cropData.humidity}%</div>
        </div>
        <div className="metric-item metric-item-rainfall">
          <div className="metric-item-icon">🌧️</div>
          <div className="metric-item-label">Rainfall</div>
          <div className="metric-item-value">{cropData.rainfall} mm</div>
        </div>
      </div>
    </div>
  );
}

export default CropCard;
