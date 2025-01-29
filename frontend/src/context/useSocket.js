import { useContext } from "react";
import SocketContext from "./socketContext";

const useSocket = () => useContext(SocketContext);

export default useSocket;
