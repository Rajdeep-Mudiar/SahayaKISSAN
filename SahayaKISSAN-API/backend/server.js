import "./config/env.js";
import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";

const app = express();
const server = http.createServer(app);

import connectDB from "./config/db.js";
connectDB();

import "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import Message from "./models/Message.js";
import ChatRoom from "./models/ChatRoom.js";

const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173", // Buyer
  "http://localhost:5174", // Seller
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "mini.sid",
    secret: "mini-projects-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* ---------------- SOCKET.IO ---------------- */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("typing", ({ roomId, userName }) => {
    socket.to(roomId).emit("showTyping", userName);
  });

  socket.on("stopTyping", ({ roomId }) => {
    socket.to(roomId).emit("hideTyping");
  });
  // 🔥 FIXED joinRoom
  socket.on("joinRoom", async ({ roomId, userId }) => {
    try {
      const room = await ChatRoom.findById(roomId);
      if (!room) return;

      const isParticipant = room.participants.some(
        (p) => p.toString() === userId
      );

      if (isParticipant) {
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
      }
    } catch (err) {
      console.error("joinRoom error:", err.message);
    }
  });

  // 🔥 Realtime send
  socket.on("sendMessage", async (data) => {
    try {
      const message = await Message.create({
        chatRoom: data.roomId,
        sender: data.senderId,
        text: data.text,
      });

      const populatedMessage = await message.populate(
        "sender",
        "name avatar"
      );

      await ChatRoom.findByIdAndUpdate(data.roomId, {
        lastMessage: data.text,
        updatedAt: new Date(),
      });

      io.to(data.roomId).emit("receiveMessage", populatedMessage);
    } catch (err) {
      console.error("sendMessage error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});


/* ---------------- ROUTES ---------------- */
app.use("/api/listings", listingRoutes);
app.use("/api/buy", buyerRoutes);
app.use("/auth", authRoutes);
app.use("/api/chat", chatRoutes);

/* ---------------- START SERVER ---------------- */
server.listen(port, () => {
  console.log(`SahayaKISSAN server running on port ${port}`);
});
