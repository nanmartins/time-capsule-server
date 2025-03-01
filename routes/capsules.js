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
    console.log("📌 Recebendo requisição para criar cápsula...");
    console.log("📝 Dados recebidos:", req.body);
    console.log("📷 Arquivo recebido:", req.file);

    const { text, openAt } = req.body;

    if (!text || !openAt) {
      return res.status(400).json({ error: "Text and open date are required" });
    }

    let imageUrl = null;
    if (req.file) {
      console.log("📤 Fazendo upload da imagem...");
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "capsules",
      });
      imageUrl = result.secure_url;
      console.log("✅ Upload concluído. URL:", imageUrl);
    }

    console.log("💾 Salvando cápsula no banco...");
    const newCapsule = new Capsule({
      userId: req.user.id,
      text,
      imageUrl,
      openAt,
    });

    await newCapsule.save();
    console.log("✅ Cápsula salva com sucesso!");

    res.status(201).json({ message: "Capsule created successfully", capsule: newCapsule });

  } catch (error) {
    console.error("🚨 ERRO NO SERVIDOR:", error);
    res.status(500).json({ error: "Error creating capsule. Check server logs!" });
  }
});



// router.post("/create", authenticate, upload.single("image"), async (req, res) => {
//   try {
//     const { text, openAt } = req.body;

//     if (!text || !openAt) {
//       return res.status(400).json({ error: "Text and open date are required" });
//     }

//     let imageUrl = null;
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "capsules",
//       });
//       imageUrl = result.secure_url;
//     }

//     const newCapsule = new Capsule({
//       userId: req.user.id,
//       text,
//       imageUrl,
//       openAt,
//     });

//     await newCapsule.save();
//     res.status(201).json({ message: "Capsule created successfully", capsule: newCapsule });

//   } catch (error) {
//     res.status(500).json({ error: "Error creating capsule. From server!!!" });
//   }
// });


///////////////////////////////////////////////////////////////////////////////////////

// Search for capsules avaialable to view
// router.get("/", authenticate, async (req, res) => {
//   try {
//     const capsules = await Capsule.find({
//       userId: req.user.id,
//       openAt: { $lte: new Date() }
//     });

//     res.status(200).json(capsules);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching capsules." });
//   }
// });

// Search for all capsules, including closed ones
// router.get("/all", authenticate, async (req, res) => {
//   try {
//     const capsules = await Capsule.find({ userId: req.user.id });

//     res.status(200).json(capsules);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching capsules." });
//   }
// });

module.exports = router;
