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
      title,
      message,
      imageUrl,
      openAt,
    });

    await newCapsule.save();
    res.status(201).json({ message: "Capsule created successfully", capsule: newCapsule });

  } catch (error) {
    res.status(500).json({ error: "Error creating capsule. Please try again." });
  }
});


// Capsules ready to view
router.get("/open", authenticate, async (req, res) => {
  try {
    const capsules = await Capsule.find({
      userId: req.user.id,
      openAt: { $lte: new Date() },
    });

    res.status(200).json(capsules);
  } catch (error) {
    res.status(500).json({ error: "Error fetching open capsules" });
  }
});

// Locked capsules
router.get("/locked", authenticate, async (req, res) => {
  try {
    const capsules = await Capsule.find({
      userId: req.user.id,
      openAt: { $gt: new Date() },
    });

    res.status(200).json(capsules);
  } catch (error) {
    res.status(500).json({ error: "Error fetching locked capsules" });
  }
});

// All capsules
router.get("/all", authenticate, async (req, res) => {
  try {
    const capsules = await Capsule.find({ userId: req.user.id });

    res.status(200).json(capsules);
  } catch (error) {
    res.status(500).json({ error: "Error fetching all capsules" });
  }
});

// Get capsule details by ID
router.get("/:id", async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id);

    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }

    res.json(capsule);
  } catch (error) {
    console.error("Error fetching capsule details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
