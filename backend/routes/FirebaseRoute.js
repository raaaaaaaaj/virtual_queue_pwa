const express = require("express");
const fbrouter = express.Router();
const sendNotification = require("../src/controllers/FirebaseController");
fbrouter.post("/send", async (req, res) => {
  const result = await sendNotification(req, res);
  return res.send(result);
});

module.exports = fbrouter;
