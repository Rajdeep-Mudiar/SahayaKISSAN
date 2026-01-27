import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  lastMessage: String
}, { timestamps: true });

export default mongoose.model("ChatRoom", chatRoomSchema);
