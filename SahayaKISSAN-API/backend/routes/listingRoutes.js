import express from "express";
import Listing from "../models/Listing.js";
import upload from "../middlewares/upload.js";
import {
  getMyListings,
  getListingForEdit,
  updateListingStatus,
  deleteListing,
  updateListing
} from "../controllers/listingController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = express.Router();

/* ================= CREATE LISTING ================= */
router.post(
  "/",
  isLoggedIn,
  upload.array("images", 6),
  async (req, res) => {
    try {
      const {
        cropName,
        category,
        variety,
        description,
        quantity,
        unit,
        price,
        minOrder,
        state,
        city,
        harvestDate,
        organic,
        mobile
      } = req.body;

      if (!cropName || !category || !quantity || !price) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields"
        });
      }

      const imageUrls = req.files?.map((file) => file.path) || [];

      const listing = await Listing.create({
        user: req.user._id, // 🔥 OWNER SET HERE
        cropName,
        category,
        variety,
        description,
        quantity,
        unit,
        price,
        minOrder,
        state,
        city,
        harvestDate,
        organic,
        mobile,
        images: imageUrls,
        status: "active"
      });

      res.status(201).json({
        success: true,
        message: "Listing created successfully",
        data: listing
      });
    } catch (error) {
      console.error("CREATE ERROR:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

/* ================= GET MY LISTINGS ================= */
router.get("/my", isLoggedIn, getMyListings);

/* ================= UPDATE STATUS ================= */
router.patch("/:id/status", isLoggedIn, updateListingStatus);

/* ================= DELETE LISTING ================= */
router.delete("/:id", isLoggedIn, deleteListing);
/* ================= EDIT ================= */
router.get("/edit/:id", isLoggedIn, getListingForEdit);
router.patch(
  "/edit/:id",
  isLoggedIn,
  upload.array("images", 6),
  updateListing
);

export default router;
