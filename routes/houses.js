const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "rental-houses",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// Add house with multiple images
router.post("/", upload.array("images", 10), async (req, res) => {
  const { name, description, location, price, rooms } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO houses (name, description, location, price, rooms) VALUES (?, ?, ?, ?, ?)",
      [name, description, location, price, rooms]
    );
    const houseId = result.insertId;

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await db.query(
          "INSERT INTO house_images (house_id, image_url) VALUES (?, ?)",
          [houseId, file.path]
        );
      }
    }

    res.status(201).json({ message: "House added." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Get all houses with images
router.get("/", async (req, res) => {
  try {
    const [houses] = await db.query("SELECT * FROM houses");
    for (const house of houses) {
      const [images] = await db.query("SELECT image_url FROM house_images WHERE house_id = ?", [house.id]);
      house.images = images.map((img) => img.image_url);
    }
    res.json(houses);
  } catch (err) {
    console.log("Houses error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update rooms
router.put("/:id", async (req, res) => {
  const { rooms } = req.body;
  try {
    await db.query("UPDATE houses SET rooms = ? WHERE id = ?", [rooms, req.params.id]);
    res.json({ message: "Rooms updated." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Delete house
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM houses WHERE id = ?", [req.params.id]);
    res.json({ message: "House deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
