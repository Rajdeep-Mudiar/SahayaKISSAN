import express from "express";
import SensorData from "../models/SensorData.js";

const router = express.Router();
let systemControl = {
  FIRE_NODE_001: true // default ON
};
// 👈 NEW: Track last heartbeat for each device
let deviceHeartbeats = {}; // { deviceId: lastSeenTimestamp }

const HEARTBEAT_TIMEOUT = 30000; // 30 seconds offline timeout

/* ================================
   POST: Save ESP32 sensor data + Update heartbeat
================================ */
router.post("/sensor-data", async (req, res) => {
  try {
    const data = new SensorData(req.body);
    await data.save();

    // 👈 Update heartbeat
    deviceHeartbeats[req.body.deviceId] = Date.now();

    res.status(201).json({
      success: true,
      message: "Sensor data saved"
    });
  } catch (error) {
    console.error("❌ Save error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save data"
    });
  }
});

/* ================================
   GET: Device status + Latest data
================================ */
router.get("/sensor-data/latest/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;

    const latestData = await SensorData
      .findOne({ deviceId })
      .sort({ createdAt: -1 });

    // 👈 Check if device is online
    const isOnline = deviceHeartbeats[deviceId] && 
      (Date.now() - deviceHeartbeats[deviceId]) < HEARTBEAT_TIMEOUT;

    if (!latestData) {
      return res.status(404).json({
        success: false,
        message: "No data found for this device",
        online: false
      });
    }

    res.json({
      success: true,
      data: latestData,
      online: isOnline,
      lastSeen: new Date(deviceHeartbeats[deviceId] || 0).toLocaleString()
    });
  } catch (error) {
    console.error("❌ Fetch latest error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ================================
   GET: History (unchanged)
================================ */
router.get("/sensor-data/history/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { range } = req.query;

    let startTime = new Date();
    if (range === "24h") {
      startTime.setHours(startTime.getHours() - 24);
    } else if (range === "7d") {
      startTime.setDate(startTime.getDate() - 7);
    }

    const data = await SensorData.find({
      deviceId,
      createdAt: { $gte: startTime }
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error("❌ History fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch history"
    });
  }
});

/* ================================
   GET: Device status only
================================ */
router.get("/sensor-data/status/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const isOnline = deviceHeartbeats[deviceId] && 
      (Date.now() - deviceHeartbeats[deviceId]) < HEARTBEAT_TIMEOUT;

    res.json({
      success: true,
      deviceId,
      online: isOnline,
      lastSeen: new Date(deviceHeartbeats[deviceId] || 0).toLocaleString(),
      offlineSince: Date.now() - (deviceHeartbeats[deviceId] || 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/system-control/:deviceId", (req, res) => {
  const { deviceId } = req.params;

  res.json({
    success: true,
    enabled: systemControl[deviceId] ?? true
  });
});
router.post("/system-control/:deviceId", (req, res) => {
  const { deviceId } = req.params;
  const { enabled } = req.body;

  systemControl[deviceId] = enabled;

  res.json({
    success: true,
    deviceId,
    enabled
  });
});

export default router;
