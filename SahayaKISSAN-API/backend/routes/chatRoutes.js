import express from "express";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import Listing from "../models/Listing.js";
import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/Message.js";

const router = express.Router();

/* ================= CREATE OR GET CHAT ROOM ================= */
router.post("/room/:listingId", isLoggedIn, async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { listingId } = req.params;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    const sellerId = listing.user;

    // 🚫 Prevent chatting with own listing
    if (buyerId.toString() === sellerId.toString()) {
      return res.status(400).json({ error: "You cannot chat with yourself" });
    }

    let room = await ChatRoom.findOne({
      listing: listingId,
      participants: { $all: [buyerId, sellerId] }
    });

    if (!room) {
      room = await ChatRoom.create({
        listing: listingId,
        participants: [buyerId, sellerId]
      });
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET ALL ROOMS FOR USER (SELLER INBOX) ================= */
router.get("/rooms", isLoggedIn, async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      participants: req.user._id
    })
      .populate("listing")
      .populate("participants", "name avatar")
      .sort({ updatedAt: -1 });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET MESSAGES OF A ROOM ================= */
router.get("/messages/:roomId", isLoggedIn, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await ChatRoom.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const isParticipant = room.participants.some(p =>
      p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await Message.find({ chatRoom: roomId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* ================= GET SINGLE ROOM WITH LISTING ================= */
router.get("/room-by-id/:roomId", isLoggedIn, async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.roomId)
      .populate("listing");  // 🔥 THIS loads product

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
