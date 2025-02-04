import { useEffect, useState } from "react";
import socket from "../utils/socketConnect";
import SocketContext from "./socketContext";

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    console.log("Connected to socket server");
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    console.log("Disconnected from socket server");
    setIsConnected(false);
  };

  useEffect(() => {
    socket.connect();

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
