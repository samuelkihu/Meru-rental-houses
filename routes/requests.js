const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all requests
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT requests.*, houses.name as house_name 
       FROM requests 
       JOIN houses ON requests.house_id = houses.id 
       ORDER BY requests.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Add request
router.post("/", async (req, res) => {
  const { house_id, student_name, student_phone } = req.body;
  try {
    await db.query(
      "INSERT INTO requests (house_id, student_name, student_phone) VALUES (?, ?, ?)",
      [house_id, student_name, student_phone]
    );
    res.status(201).json({ message: "Request submitted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Get requests by phone
router.get("/track/:phone", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT requests.*, houses.name as house_name, houses.location, houses.price 
       FROM requests 
       JOIN houses ON requests.house_id = houses.id 
       WHERE requests.student_phone = ? 
       ORDER BY requests.created_at DESC`,
      [req.params.phone]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Approve or reject request
router.put("/:id", async (req, res) => {
  const { status } = req.body;
  try {
    await db.query("UPDATE requests SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ message: "Request updated." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Delete request
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM requests WHERE id = ?", [req.params.id]);
    res.json({ message: "Request deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;