const socketio = require("socket.io");

const initializeSocket = (server) => {
  const io = socketio(server, {
    pingTimeout: 60000,
    cors: { origin: "http://localhost:5173", credentials: true },
  });

  const queues = {}; // Store queues for each room

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinRoom", ({ ride }) => {
      socket.join(ride.id);
      console.log(`Client joined room: ${ride.name}`);

      // Initialize queue for the room if it doesn't exist
      if (!queues[ride.id]) {
        queues[ride.id] = [];
      }

      // Send the current queue to the client
      socket.emit("queueUpdate", { rideId: ride.id, queue: queues[ride.id] });
    });

    socket.on("leaveRoom", ({ ride }) => {
      // socket.leave(ride.id);
      // console.log(`Client left room: ${ride.name}`);
    });

    socket.on("joinQueue", ({ rideId, name }) => {
      if (!queues[rideId]) {
        queues[rideId] = [];
      }

      // Generate a unique identifier for the user (e.g., name + socket.id)
      const userId = `${name}-${socket.id}`;

      // Calculate the user's position
      const position = queues[rideId].length + 1;

      // Add the user to the queue with their unique ID and position
      queues[rideId].push({ userId, name, position });

      console.log(`Client joined queue: ${name} at position ${position}`);
      console.log(queues[rideId]);

      // Notify the user of their current position
      socket.emit("positionUpdate", { rideId, position });

      // Broadcast the updated queue to all clients in the room
      io.to(rideId).emit("queueUpdate", { rideId, queue: queues[rideId] });
      io.emit("globalQueueUpdate", { rideId, queue: queues[rideId] });
    });

    socket.on("bulkJoinQueue", ({ rideId, baseName }) => {
      if (!queues[rideId]) {
        queues[rideId] = [];
      }
      for (let i = 1; i <= 10; i++) {
        queues[rideId].push({ name: `${baseName} ${i}` });
      }
      console.log(`Bulk joined queue with base name: ${baseName}`);
      console.log(queues[rideId]);
      io.to(rideId).emit("queueUpdate", { rideId, queue: queues[rideId] });
      io.emit("globalQueueUpdate", { rideId, queue: queues[rideId] }); // Emit global event
    });

    socket.on("popQueue", ({ rideId }) => {
      if (queues[rideId] && queues[rideId].length > 0) {
        // Remove the first customer from the queue
        queues[rideId].shift();

        // Recalculate positions for all remaining users
        queues[rideId].forEach((customer, index) => {
          customer.position = index + 1;

          // Notify users if they have reached the 5th or 1st position
          if (customer.position < 6) {
            io.to(rideId).emit("positionUpdate", {
              rideId,
              position: customer.position,
              name: customer.name,
            });
          }
        });

        console.log(`Customer popped from queue for ride: ${rideId}`);

        // Broadcast the updated queue to all clients in the room
        io.to(rideId).emit("queueUpdate", { rideId, queue: queues[rideId] });
        io.emit("globalQueueUpdate", { rideId, queue: queues[rideId] });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

module.exports = initializeSocket;
