const socketIo = require("socket.io");
const mongoose = require("mongoose");
const QueueItem = require("./models/QueueItemSchema");
const sendNotification = require("./src/controllers/FirebaseController");

function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // Replace with your frontend URL
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinRoom", async ({ ride, userId }) => {
      socket.join(ride.id);
      console.log(`Client joined room: ${ride.name} for user: ${userId}`);

      try {
        const queue = await QueueItem.find({ rideId: ride.id }).sort(
          "position",
        );
        socket.emit("queueUpdate", { rideId: ride.id, queue });
      } catch (error) {
        console.error("Error fetching queue:", error);
      }
    });

    socket.on("enqueue", async ({ rideId, userId, fcmToken, count = 1 }) => {
      try {
        const currentQueueLength = await QueueItem.countDocuments({ rideId });
        const position = currentQueueLength + 1;
        const queueItem = new QueueItem({
          rideId,
          userId,
          position,
          fcmToken,
          party_size: count,
        });

        await queueItem.save();

        const updatedQueue = await QueueItem.find({ rideId }).sort("position");
        io.to(rideId).emit("queueUpdate", { rideId, queue: updatedQueue }); // Emit to all clients in the room
      } catch (error) {
        console.error("Error enqueuing user:", error);
      }
    });

    socket.on("bulkJoinQueue", async ({ rideId, baseName }) => {
      try {
        const currentQueueLength = await QueueItem.countDocuments({ rideId });
        const queueItems = [];

        for (let i = 0; i < 10; i++) {
          const position = currentQueueLength + i + 1;
          const queueItem = new QueueItem({
            rideId,
            userId: `${baseName}-${i + 1}`,
            position,
            fcmToken: null, // No FCM token for dummy users
            party_size: 1,
          });
          queueItems.push(queueItem);
        }

        await QueueItem.insertMany(queueItems);

        const updatedQueue = await QueueItem.find({ rideId }).sort("position");
        io.to(rideId).emit("queueUpdate", { rideId, queue: updatedQueue }); // Emit to all clients in the room
      } catch (error) {
        console.error("Error in bulk joining queue:", error);
      }
    });

    socket.on("dequeue", async ({ rideId, userId, rideName }) => {
      try {
        const firstInQueue = await QueueItem.findOne({ rideId }).sort(
          "position",
        );
        if (firstInQueue) {
          await QueueItem.deleteOne({ _id: firstInQueue._id });
          await QueueItem.updateMany({ rideId }, { $inc: { position: -1 } });

          const updatedQueue = await QueueItem.find({ rideId }).sort(
            "position",
          );
          const fifthUser = updatedQueue[4]; // Get the 5th user (if exists)

          if (fifthUser?.fcmToken) {
            try {
              await sendNotification({
                devicetoken: fifthUser.fcmToken,
                title: "Queue Update",
                body: `You're now 5th for ${rideName} ! Get ready!`,
                rideId: rideId, // Pass the rideId to generate the clickAction URL
              });
            } catch (notificationError) {
              console.error("Error sending notification:", notificationError);
            }
          }

          io.to(rideId).emit("queueUpdate", { rideId, queue: updatedQueue }); // Emit to all clients in the room
        }
      } catch (error) {
        console.error("Error dequeuing user:", error);
      }
    });

    socket.on("globalUpdate", (update) => {
      const { rideId, position, waitTime, formattedArrivalTime } = update;
      io.to(rideId).emit("globalUpdate", {
        rideId,
        position,
        waitTime,
        formattedArrivalTime,
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
}

module.exports = initializeSocket;
