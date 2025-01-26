const { mongoose } = require("../db");

const queueSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  position: Number,
});

const Queue = mongoose.model("Queue", queueSchema);

module.exports = Queue;
