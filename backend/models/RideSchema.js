const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avgProcessingTime: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
    },
    capacity: {
      type: Number,
    },
    minHeight: {
      type: Number,
    },
    maxHeight: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["open", "closed", "maintenance"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Ride", RideSchema);
