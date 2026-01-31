import express from "express";
import SensorData from "../models/SensorData.js";
import fs from "fs";
import path from "path";
import gTTS from "gtts";

const router = express.Router();

/* ================================
   AUDIO STORAGE
================================ */
const AUDIO_DIR = path.join(process.cwd(), "public", "audio");
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

/* ================================
   TRACK LAST VOICE TRIGGER
================================ */
let lastVoiceTrigger = {}; 
// { FIRE_NODE_001: timestamp }

/* ================================
   GENERATE VOICE (ESP32 TRIGGERS)
================================ */
router.get("/voice/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;

    // 🔍 Fetch latest sensor data
    const latest = await SensorData
      .findOne({ deviceId })
      .sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: "No sensor data found"
      });
    }

    /* ================================
       BUILD SPEECH TEXT
    ================================ */
    let message = "Welcome to SahayaKissan Farm. ";

    if (latest.waterLevel === "HIGH") {
      message += "Soil moisture is low. Irrigation is active. ";
    } else if (latest.waterLevel === "MEDIUM") {
      message += "Soil moisture is moderate. ";
    } else if (latest.waterLevel === "LOW") {
      message += "Soil moisture is sufficient. ";
    } else {
      message += "Irrigation is currently off. ";
    }

    message += `Temperature is ${Math.round(latest.temperature)} degrees Celsius. `;
    message += `Humidity is ${Math.round(latest.humidity)} percent.`;

    /* ================================
       TEXT → SPEECH (US MALE STYLE)
    ================================ */
    const audioFile = path.join(AUDIO_DIR, `${deviceId}.mp3`);
    const gtts = new gTTS(message, "en"); // US English

    gtts.save(audioFile, () => {
      // ✅ mark voice trigger time
      lastVoiceTrigger[deviceId] = Date.now();

      res.json({
        success: true,
        audioUrl: `/audio/${deviceId}.mp3`,
        spokenText: message,
        triggeredAt: lastVoiceTrigger[deviceId]
      });
    });

  } catch (error) {
    console.error("❌ Voice generation error:", error);
    res.status(500).json({
      success: false,
      message: "Voice generation failed"
    });
  }
});

/* ================================
   VOICE STATUS (REACT LISTENS)
================================ */
router.get("/voice-status/:deviceId", (req, res) => {
  res.json({
    lastTriggered: lastVoiceTrigger[req.params.deviceId] || 0
  });
});

export default router;
