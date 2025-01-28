// filepath: /d:/Proj/virtual-queue/frontend/src/utils/socketConnect.js
import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  withCredentials: true,
});

export default socket;
