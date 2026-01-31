import mongoose from "mongoose";

const IoTRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    location: {
      type: String,
      required: true,
    },
    devices: {
      soil: { type: Boolean, default: false },
      weather: { type: Boolean, default: false },
      pest: { type: Boolean, default: false },
      scanner: { type: Boolean, default: false },
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "deployed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("IoTRequest", IoTRequestSchema);
