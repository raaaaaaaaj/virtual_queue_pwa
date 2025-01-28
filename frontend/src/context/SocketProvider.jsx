import { useEffect, useState } from "react";
import socket from "../utils/socketConnect";
import SocketContext from "./SocketContext";

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to socket server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
