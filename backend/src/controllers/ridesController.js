const Ride = require("../../models/RideSchema");

// Function to fetch all rides from the database
const getRides = async (req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rides" });
  }
};

module.exports = { getRides };
