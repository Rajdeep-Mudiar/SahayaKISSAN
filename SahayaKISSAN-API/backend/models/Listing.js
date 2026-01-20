import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    category: {
      type: String,
      enum: ["seeds", "tea"],   
      required: true
    },

    variety: String,
    description: String,

    quantity: { type: Number, required: true },
    unit: {
       type: String,
      enum: ["kg", "quintal", "ton", "piece"],
      default: "kg"
    },
    price: { type: Number, required: true },
    minOrder: Number,

    state: String,
    city: String,
    harvestDate: Date,
    organic: { type: String, enum: ["yes", "no"] },

    mobile: String,

    images: {
      type: [String],
      validate: {
        validator: v => v.length <= 6,
        message: "Maximum 6 images allowed"
      }
    },

    status: {
      type: String,
      enum: ["active", "sold", "paused"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
