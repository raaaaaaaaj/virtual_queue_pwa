const express = require("express");
const socketio = require("socket.io");
const corsMiddleware = require("./middleware/cors");
const apiRoutes = require("./routes/api");
const bodyParser = require("body-parser");
const fbroute = require("./routes/FirebaseRoute");
const cors = require("./middleware/cors");
const { credential } = require("firebase-admin");
const app = express();
const port = 8080;

app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(express.json());

app.use("/api", apiRoutes);
app.use("/api/firebase", fbroute);

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const io = socketio(server, {
  pingTimeout: 60000,
  cors: { origin: "http://localhost:5173", credentials: true },
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.emit("welcome", "Welcome to the server");

  socket.on("setup", (data) => {
    console.log("Setup data received:", data);
    const defaultRoom = "defaultRoom";

    socket.join(defaultRoom);
    console.log(`User joined room: ${defaultRoom}`);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("addUserToQueue", (data) => {
      io.to(defaultRoom).emit("userAdded", data);
    });

    socket.on("popQueue", (data) => {
      if (data.queue.length === 0) {
        console.log("Queue is empty");
        return;
      }
      io.to(defaultRoom).emit("userPopped", {
        adminName: data.adminName,
        queue: data.queue.slice(1),
      });
    });
  });
});
