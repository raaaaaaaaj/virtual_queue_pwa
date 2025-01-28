// filepath: /d:/Proj/virtual-queue/frontend/src/Components/RideQueue.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/RideQueue.css";
import { useSocket } from "../context/useSocket";
import { toast, Toaster } from "react-hot-toast";

const RideQueue = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [queue, setQueue] = useState([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    socket.on("queueUpdate", (updatedQueue) => {
      setQueue(updatedQueue);
    });

    return () => {
      socket.off("queueUpdate");
    };
  }, [isConnected, socket]);

  const toggleRole = () => {
    setRole((prevRole) => (prevRole === "customer" ? "admin" : "customer"));
  };

  const handleSubmit = () => {
    if (role === "customer") {
      console.log(
        `Client> Customer ${name} wants to join the queue for ${ride.name}`,
      );
      socket.emit("joinQueue", { rideId: ride.id, name });
      toast.success(`Successfully joined the queue for ${ride.name}`);
    } else {
      console.log(`Admin ${name} wants to pop the queue for ${ride.name}`);
      socket.emit("popQueue", { rideId: ride.id });
      toast.success(`Customer popped from the queue for ${ride.name}`);
    }
  };

  return (
    <div className="queue-container">
      <Toaster position="top-center" reverseOrder={false} />
      <h2>{ride ? ride.name : "Ride"}</h2>
      <div className="role-toggle">
        <span>Customer</span>
        <div
          className={`slider ${role === "admin" ? "active" : ""}`}
          onClick={toggleRole}
        ></div>
        <span>Admin</span>
      </div>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSubmit}>
        {role === "customer" ? "Join Queue" : "Pop Customer"}
      </button>
    </div>
  );
};

export default RideQueue;
