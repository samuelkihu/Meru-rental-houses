const express = require("express");
const router = express.Router();
const db = require("../db");

// Log visit
router.post("/", async (req, res) => {
  try {
    await db.query("INSERT INTO visits (visited_at) VALUES (NOW())");
    res.json({ message: "Visit logged." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Get visit count
router.get("/count", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM visits");
    res.json({ total: rows[0].total });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;