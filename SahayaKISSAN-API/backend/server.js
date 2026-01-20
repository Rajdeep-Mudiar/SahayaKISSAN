import "./config/env.js";

import express from "express";
import cors from "cors";
import session from "express-session"
import passport from "passport";

const app = express();

import connectDB from "./config/db.js"
connectDB();

import "./config/passport.js"

import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";

const port = process.env.PORT || 3000;
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


app.use("/api/listings", listingRoutes);
app.use("/api/buy", buyerRoutes);
app.use("/auth", authRoutes);

app.listen(port,()=>{
    console.log(`SahayaKIISAN's Server is running on port ${port}`);
  })