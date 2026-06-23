const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Email received:", email);
  console.log("Password received:", password);
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    console.log("Rows found:", rows.length);
    if (rows.length === 0) return res.status(400).json({ message: "Invalid email or password." });
    const user = rows[0];
    console.log("Hash in DB:", user.password);
    const match = await bcrypt.compare(password, user.password);
    console.log("Password match:", match);
    if (!match) return res.status(400).json({ message: "Invalid email or password." });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server error." });
  }
});
//verify tokens 
router.get("/verify", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ valid: false });
  try {
    const jwt = require("jsonwebtoken");
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true});
  } catch (err) {
    res.status(401).json({ valid: false});
  }
});
module.exports = router;