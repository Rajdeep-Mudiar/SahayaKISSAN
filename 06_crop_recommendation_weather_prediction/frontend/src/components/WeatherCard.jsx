import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./WeatherCard.css";

function WeatherCard({ weather }) {
  if (!weather) return null;

  const chartData = [
    { name: "Temperature", value: weather.temperature, unit: "°C" },
    { name: "Humidity", value: weather.humidity, unit: "%" },
    { name: "Rainfall", value: weather.rainfall, unit: "mm" },
  ];

  const getWeatherEmoji = (weatherType) => {
    const emojiMap = {
      sun: "☀️",
      rain: "🌧️",
      drizzle: "🌦️",
      snow: "❄️",
      fog: "🌫️",
    };
    return emojiMap[weatherType] || "🌤️";
  };

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div className="weather-icon-box">
          <span className="weather-emoji">
            {getWeatherEmoji(weather.predicted_weather)}
          </span>
        </div>
        <div>
          <h2 className="weather-title">Weather in {weather.city}</h2>
          <p className="weather-subtitle">Live Climate Data</p>
        </div>
      </div>

      <div className="weather-metrics">
        <div className="metric-card metric-temperature">
          <div className="metric-icon">🌡️</div>
          <div className="metric-label">Temperature</div>
          <div className="metric-value">{weather.temperature}°C</div>
        </div>

        <div className="metric-card metric-humidity">
          <div className="metric-icon">💧</div>
          <div className="metric-label">Humidity</div>
          <div className="metric-value">{weather.humidity}%</div>
        </div>

        <div className="metric-card metric-rainfall">
          <div className="metric-icon">🌧️</div>
          <div className="metric-label">Rainfall</div>
          <div className="metric-value">{weather.rainfall} mm</div>
        </div>

        <div className="metric-card metric-forecast">
          <div className="metric-icon">
            {getWeatherEmoji(weather.predicted_weather)}
          </div>
          <div className="metric-label">Forecast Prediction</div>
          <div className="metric-value" style={{ textTransform: "capitalize" }}>
            {weather.predicted_weather}
          </div>
        </div>
      </div>

      <div className="weather-analytics">
        <div className="analytics-header">
          <span className="analytics-icon">📊</span>
          <h3 className="analytics-title">Weather Analytics</h3>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis
                dataKey="name"
                stroke="#475569"
                style={{ fontSize: "14px", fontWeight: "600" }}
              />
              <YAxis
                stroke="#475569"
                style={{ fontSize: "14px", fontWeight: "600" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "3px solid #3b82f6",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  padding: "12px",
                }}
                labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px", fontWeight: "600" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={4}
                dot={{ fill: "#059669", r: 7, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 9, strokeWidth: 3 }}
                name="Value"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
