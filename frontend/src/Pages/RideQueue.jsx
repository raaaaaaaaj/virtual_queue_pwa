import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/RideQueue.css";
import useSocket from "../Hooks/useSocket";
import { toast } from "react-hot-toast";
import { useAuth } from "../Hooks/useAuth";
import QueueList from "../components/QueueList";
import RoleToggle from "../components/RoleToggle";
import PositionInfo from "../components/PositionInfo";

const RideQueue = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { fcmToken } = location.state || {};
  const [role, setRole] = useState("customer");
  const [riderType, setRiderType] = useState("single");
  const [numRiders, setNumRiders] = useState(2);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const { socket, isConnected } = useSocket();

  const [currentRideId, setCurrentRideId] = useState(null);
  const hasJoinedRoom = useRef(false);
  const { user } = useAuth(); // Use the useAuth hook to get user information
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    console.log("fcmtoken", fcmToken);
    if (!isConnected) return;

    const handleQueueUpdate = (updatedQueue) => {
      if (updatedQueue.rideId === currentRideId) {
        setQueue(updatedQueue.queue);
        setLoading(false);
        console.log("client:", updatedQueue);

        // Update user position
        const userQueueItem = updatedQueue.queue.find(
          (item) => item.userId === user?.name,
        );
        if (userQueueItem) {
          setUserPosition(userQueueItem.position);
        }
      }
    };

    socket.on("queueUpdate", handleQueueUpdate);

    return () => {
      socket.off("queueUpdate", handleQueueUpdate);
    };
  }, [isConnected, socket, currentRideId, fcmToken, user?.name]);

  useEffect(() => {
    if (ride && ride.id && !hasJoinedRoom.current) {
      setCurrentRideId(ride.id);
      socket.emit("joinRoom", { ride });
      setLoading(true);
      hasJoinedRoom.current = true;
    }
    return () => {
      if (ride && ride.id) {
        socket.emit("leaveRoom", { ride });
        setCurrentRideId(null);
        hasJoinedRoom.current = false;
      }
    };
  }, [ride, socket]);

  const toggleRole = () => {
    setRole((prevRole) => (prevRole === "customer" ? "admin" : "customer"));
  };

  const handleSubmit = () => {
    if (!user) {
      toast.error("User information is not available.");
      return;
    }

    if (role === "customer") {
      if (riderType === "single") {
        console.log(
          `Client> Single rider wants to join the queue for ${ride.name}`,
        );
        socket.emit("enqueue", {
          rideId: ride.id,
          userId: user.name,
          fcmToken: fcmToken,
        });
        toast.success(`Successfully joined the queue for ${ride.name}`);
      } else {
        console.log(
          `Client> ${numRiders} riders want to join the queue for ${ride.name}`,
        );
        socket.emit("enqueue", {
          rideId: ride.id,
          userId: user.name,
          fcmToken: fcmToken,
          count: numRiders,
        });
        toast.success(`${numRiders} riders joined the queue for ${ride.name}`);
      }
      setLoading(true);
    } else {
      console.log(`Admin ${user.name} wants to pop the queue for ${ride.name}`);
      socket.emit("dequeue", { rideId: ride.id });
      toast.success(`Customer popped from the queue for ${ride.name}`);
      setLoading(true);
    }
  };

  const handleRiderTypeChange = () => {
    setRiderType((prevType) => (prevType === "single" ? "multiple" : "single"));
  };

  const handleNumRidersChange = (e) => {
    setNumRiders(e.target.value);
  };

  const handleBulkJoin = () => {
    const baseName = "Customer";
    socket.emit("bulkJoinQueue", { rideId: ride.id, baseName });
    toast.success(`10 customers joined the queue for ${ride.name}`);
    setLoading(true);
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
      hours = hours ? hours : 12;
      const strMinutes = minutes < 10 ? "0" + minutes : minutes;
      return `${hours}:${strMinutes} ${ampm}`;
    };

    const formattedArrivalTime = formatTime(arrivalTime);

    return formattedArrivalTime;
  };

  return (
    <div className="queue-container">
      <h2>{ride ? ride.name : "Ride"}</h2>
      {user && <p>Hi {user.name}, join the queue!</p>}{" "}
      {/* Display greeting message */}
      <RoleToggle role={role} toggleRole={toggleRole} />
      {role === "customer" && (
        <div className="rider-type-toggle">
          <span>Single rider</span>
          <div
            className={`slider ${riderType === "multiple" ? "active" : ""}`}
            onClick={handleRiderTypeChange}
          ></div>
          <span>Multiple riders</span>
        </div>
      )}
      {riderType === "multiple" && role === "customer" && (
        <input
          type="number"
          min="2"
          value={numRiders}
          onChange={handleNumRidersChange}
        />
      )}
      <button onClick={handleSubmit} disabled={loading}>
        {role === "customer" ? "Join Queue" : "Pop Customer"}
      </button>
      {role === "admin" && (
        <button onClick={handleBulkJoin} disabled={loading}>
          Bulk Join Queue
        </button>
      )}
      {loading ? <div>Loading...</div> : <QueueList queue={queue} />}
      {userPosition !== null && (
        <PositionInfo
          position={userPosition}
          calculateArrivalTime={calculateArrivalTime}
        />
      )}
    </div>
  );
};

export default RideQueue;
