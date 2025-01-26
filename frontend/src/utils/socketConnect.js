import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:8080";
const socket = io(ENDPOINT);

socket.on("welcome", (data) => {
  console.log("Received welcome message:", data);
});

export default socket;
