const QueueItem = require("../../models/QueueItemSchema");
const Ride = require("../../models/RideSchema"); // Assuming you have a Ride schema to get avgProcessingTime

// Function to fetch queue lengths and estimated wait times grouped by rideId
const getQueues = async (req, res) => {
  try {
    const queues = await QueueItem.aggregate([
      {
        $group: {
          _id: "$rideId", // Group by rideId
          queueLength: { $sum: "$party_size" }, // Calculate the queue length based on party sizes
        },
      },
      {
        $lookup: {
          from: "rides", // Assuming the rides collection is named "rides"
          localField: "_id",
          foreignField: "id",
          as: "rideInfo",
        },
      },
      {
        $unwind: "$rideInfo",
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field
          rideId: "$_id", // Rename _id to rideId
          queueLength: 1, // Include the queueLength field
          avgProcessingTime: "$rideInfo.avgProcessingTime", // Include the avgProcessingTime field
        },
      },
      {
        $addFields: {
          estimatedWaitTime: {
            $multiply: ["$queueLength", "$avgProcessingTime"],
          }, // Calculate the estimated wait time
        },
      },
    ]);

    res.status(200).json(queues);
  } catch (error) {
    console.error(
      "Error fetching queue lengths and estimated wait times:",
      error,
    );
    res.status(500).json({
      error: "Failed to fetch queue lengths and estimated wait times",
    });
  }
};

module.exports = { getQueues };
