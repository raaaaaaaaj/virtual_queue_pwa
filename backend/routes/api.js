const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../db");
const mockAuthMiddleware = require("../middleware/mockAuthMiddleware");
const authController = require("../src/controllers/authController");
// const {
//   addUserToQueue,
//   getQueueData,
// } = require("../src/controllers/queueController");
const { getRides } = require("../src/controllers/ridesController");
const { getQueues } = require("../src/controllers/queueController");

connectToDatabase();
router.use(mockAuthMiddleware);
router.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// router.post("/add-to-queue", addUserToQueue);
// router.get("/queue", getQueueData);
router.get("/rides", getRides);
router.get("/queueitems", getQueues);
router.get("/auth/check", authController.checkAuth);
module.exports = router;
