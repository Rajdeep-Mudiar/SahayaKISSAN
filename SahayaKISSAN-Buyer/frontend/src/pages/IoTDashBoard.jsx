import { useEffect, useState, useCallback, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import api from "../api/axios";
import "./IoTDashboard.css";

const DEVICE_ID = "FIRE_NODE_001";

export default function IoTDashboard() {
  const [data, setData] = useState(null);
  const [systemEnabled, setSystemEnabled] = useState(true);

  const [deviceStatus, setDeviceStatus] = useState({
    online: false,
    lastSeen: null,
    offlineSince: 0
  });
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [range, setRange] = useState("24h");
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const intervalRef = useRef(null);
  const dashboardRef = useRef(null);
  const [polling, setPolling] = useState(false); // optional


  // ✅ FIXED: Stable device status ref for callbacks
  const deviceStatusRef = useRef(deviceStatus);
const fetchSystemControl = useCallback(async () => {
  try {
    const res = await api.get(`/api/system-control/${DEVICE_ID}`);
    if (res.data?.success) {
      setSystemEnabled(res.data.enabled);
    }
  } catch (err) {
    console.error("System control fetch failed", err);
  }
}, []);

const toggleSystem = useCallback(async () => {
  const newState = !systemEnabled;

  await api.post(`/api/system-control/${DEVICE_ID}`, {
    enabled: newState
  });

  setSystemEnabled(newState);
}, [systemEnabled]);

  // Update ref whenever deviceStatus changes
  useEffect(() => {
    deviceStatusRef.current = deviceStatus;
  }, [deviceStatus]);

  // ✅ FIXED: Stable checkDeviceStatus - no dependencies
  const checkDeviceStatus = useCallback(async () => {
    try {
      const res = await api.get(`/api/sensor-data/status/${DEVICE_ID}`);
      if (res.data?.success) {
        setDeviceStatus(res.data);
      }
    } catch (err) {
      console.error("Status check error:", err);
      setDeviceStatus({ online: false, lastSeen: null, offlineSince: 0 });
    }
  }, []);

  // ✅ FIXED: Stable fetchData - no dependencies
    const fetchData = useCallback(async () => {
    try {
        const res = await api.get(`/api/sensor-data/latest/${DEVICE_ID}`);

        if (res.data?.success && res.data.data) {
        setData(res.data.data);
        setError(null);
        setDeviceStatus(prev => ({
            ...prev,
            online: res.data.online || false
        }));
        } else {
        setError("No data received from server");
        }
    } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Failed to fetch data from backend");
    } finally {
        setLoading(false)
    }
    }, []);

  // ✅ FIXED: Stable fetchHistory - only depends on range
  const fetchHistory = useCallback(async () => {
    // ✅ Use ref to check current status (no stale closure)
    if (!deviceStatusRef.current.online) return;
    
    try {
      const res = await api.get(`/api/sensor-data/history/${DEVICE_ID}?range=${range}`);
      if (res.data?.success) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error("❌ History fetch error:", err);
    }
  }, [range]); // ✅ Removed deviceStatus dependency

  // ✅ FIXED: Stable PDF - uses ref
  const downloadPDF = useCallback(async () => {
    if (!dashboardRef.current || !deviceStatusRef.current.online) {
      alert("Device must be online to generate report");
      return;
    }

    try {
      setGeneratingPDF(true);
      console.log("📄 Generating PDF...");
      
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#f5f7fa",
        width: dashboardRef.current.scrollWidth,
        height: dashboardRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      pdf.save(`${DEVICE_ID}_Fire_Monitor_${range}_${timestamp}.pdf`);
      console.log("✅ PDF saved!");
    } catch (error) {
      console.error("❌ PDF Error:", error);
      alert("PDF generation failed. Please try again.");
    } finally {
      setGeneratingPDF(false);
    }
  }, [range]);

  // 🎯 FIXED MAIN EFFECT - Stable dependencies only
  useEffect(() => {
  const init = async () => {
    setLoading(true);
    await fetchSystemControl();   // ✅ ADD THIS
    await checkDeviceStatus();
    await fetchData();
    if (deviceStatusRef.current?.online) {
      await fetchHistory();
    }
    setLoading(false); // ✅ only once
  };

  init();

  intervalRef.current = setInterval(async () => {
    await checkDeviceStatus();
    await fetchData();
    if (deviceStatusRef.current?.online) {
      fetchHistory();
    }
  }, 5000);

  return () => clearInterval(intervalRef.current);
}, [checkDeviceStatus, fetchData, fetchHistory]);

  useEffect(() => {
    if (deviceStatusRef.current.online) {
      console.log(`📊 Range changed: ${range}`);
      fetchHistory();
    }
  }, [range, fetchHistory]); // ✅ Removed deviceStatus dependency

  // 👈 OFFLINE SCREEN
  if (!deviceStatus.online && !loading) {
    return (
      <div className="offline-screen">
        <div className="offline-content">
          <div className="offline-icon">🔌</div>
          <h1 className="offline-title">Device Offline</h1>
          <p className="offline-message">
            {deviceStatus.lastSeen 
              ? `Last seen: ${new Date(deviceStatus.lastSeen).toLocaleString()}` 
              : "No connection history found"
            }
          </p>
          <p className="offline-subtitle">
            Connect ESP32 via USB to resume fire monitoring
          </p>
          <div className="status-indicator offline">● OFFLINE</div>
          <div className="check-again">
            Checking connection every 5 seconds...
          </div>
        </div>
      </div>
    );
  }

  // 🔄 Loading screen
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          <h2>Checking device connection...</h2>
          <p>Waiting for ESP32 heartbeat</p>
        </div>
      </div>
    );
  }

  // 📊 ONLINE DASHBOARD - Same rendering logic
  const chartData = {
    tempHistory: history.map(d => ({
      time: new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Number(d.temperature),
      timestamp: d.createdAt
    })),
    humidityHistory: history.map(d => ({
      time: new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Number(d.humidity),
      timestamp: d.createdAt
    })),
    soilHistory: history.map(d => ({
      time: new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Number(d.soil),
      timestamp: d.createdAt
    }))
  };

  const fireHistoryFiltered = history.filter(d => d.flame === true);
  const analytics = {
    fireCount: fireHistoryFiltered.length,
    avgTemp: history.length > 0 
      ? (history.reduce((sum, d) => sum + Number(d.temperature), 0) / history.length).toFixed(1)
      : 0,
    avgHumidity: history.length > 0 
      ? (history.reduce((sum, d) => sum + Number(d.humidity), 0) / history.length).toFixed(1)
      : 0,
    avgSoil: history.length > 0 
      ? Math.round(history.reduce((sum, d) => sum + Number(d.soil), 0) / history.length)
      : 0,
    maxTemp: history.length > 0 ? Math.max(...history.map(d => Number(d.temperature))) : 0,
    minTemp: history.length > 0 ? Math.min(...history.map(d => Number(d.temperature))) : 0
  };

  const fireAngleData = [
    { name: "Fire Direction", value: data.fireAngle || 0 },
    { name: "Safe Zone", value: 180 - (data.fireAngle || 0) }
  ];


  return (
    <div className="iot-dashboard">
      <div ref={dashboardRef}>
        <header className="dashboard-header">
          <h1 className="dashboard-title">
            🔥 Agricultural Fire Monitoring System
            <span className={`status-badge online`}>● LIVE</span>
          </h1>
          <button
            className={`system-toggle ${systemEnabled ? "on" : "off"}`}
            onClick={toggleSystem}
          >
            {systemEnabled ? "🟢 System ON" : "🔴 System OFF"}
          </button>

          <div className="header-actions">
            <button 
              className="download-btn pdf-btn" 
              onClick={downloadPDF} 
              disabled={generatingPDF}
            >
              {generatingPDF ? "📄 Generating PDF..." : "📄 Download PDF Report"}
            </button>
            <div className="range-selector">
              <button 
                className={`range-btn ${range === "24h" ? "active" : ""}`}
                onClick={() => setRange("24h")}
              >
                24 Hours
              </button>
              <button 
                className={`range-btn ${range === "7d" ? "active" : ""}`}
                onClick={() => setRange("7d")}
              >
                7 Days
              </button>
            </div>
          </div>
          <div className="device-info">
            <span>📡 Device: <strong>{data.deviceId || DEVICE_ID}</strong></span>
            <span>🕐 Last Update: {new Date().toLocaleTimeString()}</span>
            <span>📶 Status: <strong>ONLINE</strong></span>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="status-grid">
            <StatusCard 
              title="🔥 Fire Detection Status"
              value={data.flame ? "🚨 FIRE DETECTED" : "✅ SAFE"}
              status={data.flame ? "danger" : "success"}
              description={
                data.flame 
                  ? "Active fire detected. Servo locked at optimal angle. Water system automatically engaged for suppression."
                  : "No fire detected. System continuously scanning 180° field of view."
              }
            />

            <MetricCard 
              title="🌡️ Temperature"
              value={`${data.temperature || 0}°C`}
              trend="stable"
              unit="°C"
              chartData={[{ name: "Current", value: data.temperature || 0 }]}
            />

            <MetricCard 
              title="💧 Relative Humidity"
              value={`${data.humidity || 0}%`}
              trend="stable"
              unit="%"
              chartData={[{ name: "Current", value: data.humidity || 0 }]}
              optimalRange="40-60%"
            />

            <MetricCard 
              title="🌱 Soil Moisture"
              value={data.soil || 0}
              trend={data.soil > 2000 ? "warning" : "success"}
              statusText={data.soil > 2000 ? "DRY - Needs Irrigation" : "OPTIMAL"}
              chartData={[{ name: "Current", value: data.soil || 0 }]}
            />

            <StatusCard 
              title="🚿 Water System"
              value={data.waterLevel ? "ACTIVE" : "STANDBY"}
              status={data.waterLevel ? "success" : "info"}
              description="Automated irrigation and fire suppression system status."
            />

            <PieChartCard 
              title="🧭 Fire Direction"
              data={fireAngleData}
              currentAngle={data.fireAngle || 0}
            />
          </div>

          <div className="analytics-grid">
            <AnalyticsCard title="📊 System Analytics" analytics={analytics} range={range} />
          </div>

          <div className="history-grid">
            <HistoryChart 
              title="🌡️ Temperature Trend" 
              data={chartData.tempHistory}
              color="#ff6b35"
              range={range}
            />
            <HistoryChart 
              title="💧 Humidity Trend" 
              data={chartData.humidityHistory}
              color="#4ecdc4"
              range={range}
            />
            <HistoryChart 
              title="🌱 Soil Moisture Trend" 
              data={chartData.soilHistory}
              color="#45b7d1"
              type="bar"
              range={range}
            />
          </div>

          <FireEventsCard fireHistory={fireHistoryFiltered} range={range} />
        </main>
      </div>
    </div>
  );
}

// All sub-components remain exactly the same...
function StatusCard({ title, value, status, description }) {
  return (
    <div className={`status-card status-${status}`}>
      <h3 className="card-title">{title}</h3>
      <div className="status-value">{value}</div>
      <p className="status-description">{description}</p>
    </div>
  );
}

function MetricCard({ title, value, trend, statusText, chartData, unit, optimalRange }) {
  return (
    <div className="metric-card">
      <h3 className="card-title">{title}</h3>
      <div className="metric-value">{value} <span className="unit">{unit}</span></div>
      {statusText && <div className={`metric-status status-${trend}`}>{statusText}</div>}
      
      <div className="metric-chart">
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData}>
            <Bar dataKey="value" fill="var(--primary-color)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {optimalRange && (
        <div className="optimal-range">Optimal: {optimalRange}</div>
      )}
    </div>
  );
}

function PieChartCard({ title, data, currentAngle }) {
  return (
    <div className="pie-chart-card">
      <h3 className="card-title">{title}</h3>
      <div className="pie-chart-container">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              startAngle={180}
              endAngle={0}
              innerRadius={35}
              outerRadius={70}
              dataKey="value"
            >
              <Cell fill="#ff4444" />
              <Cell fill="#e0e0e0" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="angle-display">
        Current Angle: <strong>{currentAngle}°</strong>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, analytics, range }) {
  return (
    <div className="analytics-card">
      <h3 className="card-title">{title}</h3>
      <div className="analytics-grid">
        <AnalyticsBox label="🔥 Fire Alerts" value={analytics.fireCount} />
        <AnalyticsBox label="🌡️ Avg Temp" value={`${analytics.avgTemp}°C`} />
        <AnalyticsBox label="💧 Avg Humidity" value={`${analytics.avgHumidity}%`} />
        <AnalyticsBox label="🌱 Avg Soil" value={analytics.avgSoil} />
        <AnalyticsBox label="🔥 Max Temp" value={`${analytics.maxTemp}°C`} />
        <AnalyticsBox label="❄️ Min Temp" value={`${analytics.minTemp}°C`} />
      </div>
      <div className="analytics-footer">
        📅 Time Range: {range === "24h" ? "Last 24 Hours" : "Last 7 Days"}
      </div>
    </div>
  );
}

function HistoryChart({ title, data, color, type = "line", range }) {
  return (
    <div className="history-card">
      <h3 className="card-title">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        {type === "line" ? (
          <LineChart data={data}>
            <XAxis dataKey="time" angle={-45} height={60} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={false} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <XAxis dataKey="time" angle={-45} height={60} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill={color} />
          </BarChart>
        )}
      </ResponsiveContainer>
      <div className="history-footer">
        📅 {range === "24h" ? "Last 24 Hours" : "Last 7 Days"} • Real-time monitoring every 5 seconds
      </div>
    </div>
  );
}

function FireEventsCard({ fireHistory, range }) {
  return (
    <div className="fire-events-card">
      <h3 className="card-title">🔥 Fire Detection Events</h3>
      {fireHistory.length === 0 ? (
        <div className="no-events">
          ✅ No fire events recorded in selected time range
        </div>
      ) : (
        <div className="events-list">
          {fireHistory.slice(0, 10).map((event, index) => (
            <div key={index} className="event-item">
              <span className="event-time">{new Date(event.createdAt).toLocaleString()}</span>
              <span className="event-angle">Angle: {event.fireAngle}°</span>
            </div>
          ))}
          {fireHistory.length > 10 && (
            <div className="events-count">... and {fireHistory.length - 10} more events</div>
          )}
        </div>
      )}
      <div className="history-footer">
        📅 {range === "24h" ? "Last 24 Hours" : "Last 7 Days"}
      </div>
    </div>
  );
}

function AnalyticsBox({ label, value }) {
  return (
    <div className="analytics-box">
      <div className="analytics-label">{label}</div>
      <div className="analytics-value">{value}</div>
    </div>
  );
}
