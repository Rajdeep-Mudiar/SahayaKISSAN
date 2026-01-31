import express from "express";
import IoTRequest from "../models/IoTRequest.js";

const router = express.Router();

/**
 * @route   POST /api/iot/request
 * @desc    Create new IoT deployment request
 */
router.post("/request", async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      location,
      devices,
      message,
    } = req.body;

    if (!fullName || !phone || !email || !location) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const newRequest = await IoTRequest.create({
      fullName,
      phone,
      email,
      location,
      devices,
      message,
    });

    res.status(201).json({
      success: true,
      message: "IoT deployment request submitted successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("IoT Request Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**
 * @route   GET /api/iot/requests
 * @desc    Get all requests (admin/dashboard)
 */
router.get("/requests", async (req, res) => {
  try {
    const requests = await IoTRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

export default router;
