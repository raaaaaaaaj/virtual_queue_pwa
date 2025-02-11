import { useContext } from "react";
import SocketContext from "../Contexts/socketContext";

const useSocket = () => useContext(SocketContext);

export default useSocket;
