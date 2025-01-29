import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/RideQueue.css";
import useSocket from "../context/useSocket";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const RideQueue = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { fcmToken } = location.state || {};
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [queue, setQueue] = useState([]);
  const [position, setPosition] = useState(null); // Track user's position
  const { socket, isConnected } = useSocket();
  useEffect(() => {
    console.log("FCM Token queue page:", fcmToken);
  }, [fcmToken]);

  useEffect(() => {
    if (!isConnected) return;
    const handlePositionUpdate = async ({
      position: newPosition,
      name: notifiedName,
    }) => {
      console.log("Position Update Received:", newPosition, notifiedName);
      if (notifiedName === name) {
        console.log("notifiedName === name");
        setPosition(newPosition);
        if (newPosition <= 5) {
          try {
            const response = await axios.post(
              "http://localhost:8080/api/firebase/send",
              {
                title: "Update!",
                body: `You are now ${newPosition}th! at ${ride.name}`,
                devicetoken: fcmToken,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );

            console.log("Success:", response.data);
          } catch (error) {
            console.error("Error:", error);
          }
        }
      }
    };
    socket.on("queueUpdate", (updatedQueue) => {
      setQueue(updatedQueue.queue);
      console.log("client:", updatedQueue);
    });

    socket.on("positionUpdate", handlePositionUpdate);

    return () => {
      socket.off("queueUpdate");
      socket.off("positionUpdate");
    };
  }, [isConnected, socket, name, fcmToken, ride.name]);

  useEffect(() => {
    if (ride && ride.id) {
      socket.emit("joinRoom", { ride });
    }
    return () => {
      if (ride && ride.id) {
        socket.emit("leaveRoom", { ride });
      }
    };
  }, [ride, socket]);

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

  const handleBulkJoin = () => {
    const baseName = "Customer";
    socket.emit("bulkJoinQueue", { rideId: ride.id, baseName });
    toast.success(`10 customers joined the queue for ${ride.name}`);
  };

  const calculateArrivalTime = (position) => {
    if (!ride || !ride.avgProcessingTime) return null;

    const now = new Date();
    const waitTime = position * ride.avgProcessingTime;
    const arrivalTime = new Date(now.getTime() + waitTime * 60000);

    const formatTime = (date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const strMinutes = minutes < 10 ? "0" + minutes : minutes;
      return `${hours}:${strMinutes} ${ampm}`;
    };

    const startTime = formatTime(now);
    const endTime = formatTime(arrivalTime);

    return `${startTime} - ${endTime}`;
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
      {role === "admin" && (
        <button onClick={handleBulkJoin}>Bulk Join Queue</button>
      )}
      <div className="queue-list">
        <h3>Queue</h3>
        <ul>
          {Array.isArray(queue) &&
            queue.map((customer, index) => (
              <li key={index}>
                {customer.name} - Position: {customer.position}
              </li>
            ))}
        </ul>
      </div>
      {position !== null && (
        <div className="position-info">
          <p>Your current position: {position}</p>
          <p>Estimated arrival time: {calculateArrivalTime(position)}</p>
        </div>
      )}
    </div>
  );
};

export default RideQueue;
