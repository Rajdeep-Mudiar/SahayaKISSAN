import express from "express";

const router = express.Router();

// In-memory (later can move to DB)
let fireControl = {
  FIRE_NODE_001: true
};

// GET fire status
router.get("/fire-control/:deviceId", (req, res) => {
  const { deviceId } = req.params;
  res.json({
    success: true,
    enabled: fireControl[deviceId] ?? false
  });
});

// POST toggle fire
router.post("/fire-control/:deviceId", (req, res) => {
  const { deviceId } = req.params;
  const { enabled } = req.body;

  fireControl[deviceId] = enabled;

  res.json({
    success: true,
    enabled
  });
});

export default router;
