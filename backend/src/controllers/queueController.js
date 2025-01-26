const Queue = require("../../models/QueueSchema");
const User = require("../../models/UserSchema");

const addUserToQueue = async (req, res) => {
  const { name, fcmToken, position } = req.body;
  try {
    // Find or create the user
    let user = await User.findOne({ name, fcmToken });
    if (!user) {
      user = new User({ name, fcmToken });
      await user.save();
    }

    // Add the user to the queue
    const newUserInQueue = new Queue({ user: user._id, position });
    const result = await newUserInQueue.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding user to queue:", error);
    res.status(500).json({ error: "Failed to add user to queue" });
  }
};

const getQueueData = async (req, res) => {
  try {
    const queue = await Queue.find().populate("user", "name fcmToken").exec();
    res.status(200).json(queue);
  } catch (error) {
    console.error("Error retrieving queue data:", error);
    res.status(500).json({ error: "Failed to retrieve queue data" });
  }
};

module.exports = { addUserToQueue, getQueueData };
