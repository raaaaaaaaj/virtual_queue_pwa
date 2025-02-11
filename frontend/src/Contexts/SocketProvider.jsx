import { useEffect, useState } from "react";
import socket from "../utils/socketConnect";
import SocketContext from "./socketContext";
import { useAuth } from "../Hooks/useAuth"; // Import useAuth to get the user information

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth(); // Get the user information from AuthContext

  const handleConnect = () => {
    console.log("Connected to socket server");
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    console.log("Disconnected from socket server");
    setIsConnected(false);
  };

  useEffect(() => {
    if (user) {
      socket.connect();

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
