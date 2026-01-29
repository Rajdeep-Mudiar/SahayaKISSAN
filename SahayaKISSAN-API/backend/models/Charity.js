import mongoose from "mongoose";

const charityOfferSchema = new mongoose.Schema(
  {
    // Crop details
    cropName: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: String,
      required: true,
    },

    price: {
      type: String,
      required: true,
    },

    // Location
    state: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    // Where farmer wants to sell / donate
    sellTo: {
      type: String,
      required: true,
      enum: ["ashram", "temple", "ngo", "community_kitchen"],
    },

    // Contact details
    mobile: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

export default mongoose.model("CharityOffer", charityOfferSchema);
