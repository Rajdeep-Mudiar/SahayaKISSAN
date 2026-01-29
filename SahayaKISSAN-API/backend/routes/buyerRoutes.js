import express from "express";
import Listing from "../models/Listing.js";
import Review from "../models/Review.js";

const router = express.Router();

// GET listings by category (buyer)
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const { priceMax, state, city, nearby, page = 1, limit = 12 } = req.query;

    const filter = {
      category,
      status: "active",

      // Price filter
      ...(priceMax && { price: { $lte: Number(priceMax) } }),

      // Normal state filter (existing)
      ...(state && { state }),

      // 🔥 NEW: Nearby city filter
      ...(nearby === "true" && city && { city })
    };

    const listings = await Listing.find(filter)
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Listing.countDocuments(filter);

    res.json({
      success: true,
      data: listings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/product/:id', async (req, res) => {
  try {
    const product = await Listing.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/reviews/:productId', async (req, res) => {
  try {
    const review = new Review({
      productId: req.params.productId,
      ...req.body
    });
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save review' });
  }
});

//Home page product showing logic
router.get("/low-price-random", async (req, res) => {
  try {
    // 1️⃣ Get 20 cheapest active listings
    const cheapListings = await Listing.find({
      status: "active"
    })
      .sort({ price: 1 })
      .limit(20)
      .select("cropName price images unit category");

    // 2️⃣ Shuffle
    const shuffled = cheapListings.sort(() => 0.5 - Math.random());

    // 3️⃣ Pick 4
    const selected = shuffled.slice(0, 4);

    res.status(200).json({
      success: true,
      count: selected.length,
      data: selected
    });
  } catch (error) {
    console.error("Low price fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });
  }
});
export default router;
