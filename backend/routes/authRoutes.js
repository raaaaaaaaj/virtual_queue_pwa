const express = require("express");
const {
  registerUser,
  loginUser,
  checkAuth,
} = require("../src/controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check", protect, checkAuth); // Add this route for checking authentication

module.exports = router;
