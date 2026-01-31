import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true
    },
    soil: Number,
    humidity: Number,
    temperature: Number,
    waterLevel: String,
    flame: Boolean,
    fireAngle: Number
  },
  { timestamps: true }
);

export default mongoose.model("SensorData", sensorDataSchema);
