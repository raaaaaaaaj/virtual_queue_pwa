const mongoose = require("mongoose");

const QueueItemSchema = new mongoose.Schema({
  rideId: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  party_size: {
    type: Number,
    default: 1,
  },
  fcmToken: {
    type: String,
  },
});

module.exports = mongoose.model("QueueItem", QueueItemSchema);
