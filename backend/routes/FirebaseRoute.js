const express = require("express");
const fbrouter = express.Router();
const sendNotification = require("../src/controllers/FirebaseController");

fbrouter.post("/send", async (req, res) => {
  const { devicetoken, title, body } = req.body;
  const result = await sendNotification({ devicetoken, title, body });
  return res.status(result.success ? 200 : 500).json(result);
});

module.exports = fbrouter;
