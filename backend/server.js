// filepath: /d:/Proj/virtual-queue/backend/server.js
const express = require("express");
const corsMiddleware = require("./middleware/cors");
const apiRoutes = require("./routes/api");
const bodyParser = require("body-parser");
const fbroute = require("./routes/FirebaseRoute");
const initializeSocket = require("./socket");
const { connectToDatabase } = require("./db");

const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(express.json());

app.use("/api", apiRoutes);
app.use("/api/firebase", fbroute);

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const io = initializeSocket(server);
app.set("io", io);
