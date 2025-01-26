const express = require("express");
const router = express.Router();
// const { connectToDatabase } = require("../db");
const {
  addUserToQueue,
  getQueueData,
} = require("../src/controllers/queueController");

// connectToDatabase();

router.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

router.post("/add-to-queue", addUserToQueue);
router.get("/queue", getQueueData);

module.exports = router;
