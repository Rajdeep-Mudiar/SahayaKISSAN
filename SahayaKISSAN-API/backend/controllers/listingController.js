import Listing from "../models/Listing.js";



export const getMyListings = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {
      user: req.user._id // 🔐 ONLY MY LISTINGS
    };

    if (status) {
      filter.status = status;
    }

    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const listing = await Listing.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id // 🔐 OWNER CHECK
      },
      { status },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found or unauthorized" });
    }

    res.json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/* ================= DELETE LISTING ================= */
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id // 🔐 OWNER CHECK
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found or unauthorized" });
    }

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= GET LISTING FOR EDIT ================= */
export const getListingForEdit = async (req, res) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      user: req.user._id // 🔒 OWNER CHECK
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE LISTING ================= */
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      user: req.user._id // 🔒 OWNER CHECK
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const fields = [
      "cropName", "category", "variety", "description",
      "quantity", "unit", "price", "minOrder",
      "state", "city", "harvestDate", "organic", "mobile"
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

    // Remove images
    if (req.body.deleteImages) {
      const deleteImages = Array.isArray(req.body.deleteImages)
        ? req.body.deleteImages
        : [req.body.deleteImages];

      listing.images = listing.images.filter(
        img => !deleteImages.includes(img)
      );
    }

    // Add new images
    if (req.files?.length) {
      const newImages = req.files.map(file => file.path);
      listing.images.push(...newImages);
    }

    await listing.save();

    res.json({
      success: true,
      message: "Listing updated successfully",
      data: listing
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
