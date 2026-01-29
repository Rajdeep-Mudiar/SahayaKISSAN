import express from "express";
import CharityOffer from "../models/Charity.js";

const router = express.Router();

/* -------------------------------------------------
   POST: Create a new charity offer (from Charity.jsx)
   URL: /api/charity
-------------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      price,
      state,
      city,
      sellTo,
      mobile,
    } = req.body;

    // Basic validation
    if (
      !cropName ||
      !quantity ||
      !price ||
      !state ||
      !city ||
      !sellTo ||
      !mobile
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newOffer = new CharityOffer({
      cropName,
      quantity,
      price,
      state,
      city,
      sellTo,
      mobile,
    });

    await newOffer.save();

    res.status(201).json({
      success: true,
      message: "Charity offer created successfully",
      data: newOffer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create charity offer",
      error: error.message,
    });
  }
});

/* -------------------------------------------------
   GET: Fetch charity offers (filtered)
   URL: /api/charity?state=Assam&city=Guwahati&sellTo=ashram
-------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const { state, city, sellTo } = req.query;

    const filter = {};
    if (state) filter.state = state;
    if (city) filter.city = city;
    if (sellTo) filter.sellTo = sellTo;

    const offers = await CharityOffer.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch charity offers",
      error: error.message,
    });
  }
});

/* -------------------------------------------------
   GET: Fetch single offer by ID (optional)
   URL: /api/charity/:id
-------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const offer = await CharityOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Charity offer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching charity offer",
      error: error.message,
    });
  }
});

export default router;

