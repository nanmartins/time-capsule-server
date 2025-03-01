const express = require("express");
const multer = require("multer");
const cloudinary = require("../services/cloudinary");
const Capsule = require("../models/Capsule");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

// Create a new capsule
router.post("/create", authenticate, upload.single("image"), async (req, res) => {
  try {
    const { text, openAt } = req.body;

    if (!text || !openAt) {
      return res.status(400).json({ error: "Text and open date are required" });
    }

    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "capsules",
      });
      imageUrl = result.secure_url;
    }

    const newCapsule = new Capsule({
      userId: req.user.id,
      text,
      imageUrl,
      openAt,
    });

    await newCapsule.save();
    res.status(201).json({ message: "Capsule created successfully", capsule: newCapsule });

  } catch (error) {
    res.status(500).json({ error: "Error creating capsule. Please try again." });
  }
});

// Get capsules available to view
router.get("/available", authenticate, async (req, res) => {
  try {
    const capsules = await Capsule.find({
      userId: req.user.id,
      // Only show capsules that are open
      openAt: { $lte: new Date() },
    });

    res.status(200).json(capsules);
  } catch (error) {
    res.status(500).json({ error: "Error fetching capsules. Please try again." });
  }
});

// Get all capsules (including closed ones)
router.get("/all", authenticate, async (req, res) => {
  try {
    const capsules = await Capsule.find({ userId: req.user.id });

    res.status(200).json(capsules);
  } catch (error) {
    res.status(500).json({ error: "Error fetching capsules. Please try again." });
  }
});


module.exports = router;
