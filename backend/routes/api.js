// filepath: /d:/Proj/virtual-queue/backend/routes/api.js
const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../db");
const authRoutes = require("./authRoutes");
const { protect } = require("../middleware/authMiddleware");
const { getRides } = require("../src/controllers/ridesController");
const { getQueues } = require("../src/controllers/queueController");
const {
  getParkInfo,
  saveParkInfo,
} = require("../src/controllers/parkController"); // Import the controller

connectToDatabase();
router.use("/auth", authRoutes);
router.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});
router.get("/protected", protect, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

router.get("/rides", getRides);
router.get("/queueitems", getQueues);
router.get("/park-info", getParkInfo); // Add the new endpoint
router.post("/park-info", saveParkInfo);

module.exports = router;
