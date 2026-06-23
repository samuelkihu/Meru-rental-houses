const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const visitroutes = require("./routes/visits");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/auth");
const houseRoutes = require("./routes/houses");
const requestRoutes = require("./routes/requests");

app.use("/api/auth", authRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/visits", visitroutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));