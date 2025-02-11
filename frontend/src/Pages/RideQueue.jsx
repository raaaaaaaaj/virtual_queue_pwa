import { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/RideQueue.css";
import useSocket from "../Hooks/useSocket";
import { toast } from "react-hot-toast";
import { useAuth } from "../Hooks/useAuth";
import QueueList from "../components/QueueList";
import PositionInfo from "../components/PositionInfo";
import { useQueue } from "../Contexts/QueueContext";
import { GeolocationContext } from "../Contexts/GeolocationContext";

const RideQueue = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { fcmToken } = location.state || {};
  const [riderType, setRiderType] = useState("single");
  const [numRiders, setNumRiders] = useState(2);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const { socket, isConnected } = useSocket();
  const { queues, setQueueInfo } = useQueue();
  const { userLocation, parkCenter, parkRadius } =
    useContext(GeolocationContext);

  const [currentRideId, setCurrentRideId] = useState(null);
  const hasJoinedRoom = useRef(false);
  const { user, isLoading: isAuthLoading } = useAuth(); // Use the useAuth hook to get user information and loading state
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    console.log("fcmtoken", fcmToken);
    if (!isConnected || !user) return;

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
          const position = userQueueItem.position;
          const { waitTime, formattedArrivalTime } =
            calculateArrivalTime(position);
          setUserPosition(position);
          setQueueInfo(currentRideId, {
            position,
            waitTime,
            formattedArrivalTime,
          });
          socket.emit("globalUpdate", {
            rideId: currentRideId,
            userId: user.name,
            position,
            waitTime,
            formattedArrivalTime,
          });
        } else {
          setUserPosition(null);
          setQueueInfo(currentRideId, {
            position: null,
            waitTime: null,
            formattedArrivalTime: null,
          });
        }
      }
    };

    socket.on("queueUpdate", handleQueueUpdate);

    return () => {
      socket.off("queueUpdate", handleQueueUpdate);
    };
  }, [isConnected, socket, currentRideId, fcmToken, user?.name]);

  useEffect(() => {
    if (ride && ride.id && !hasJoinedRoom.current && user) {
      setCurrentRideId(ride.id);
      socket.emit("joinRoom", { ride, userId: user.name });
      setLoading(true);
      hasJoinedRoom.current = true;
    }
    return () => {
      if (ride && ride.id && user) {
        socket.emit("leaveRoom", { ride, userId: user.name });
        setCurrentRideId(null);
        hasJoinedRoom.current = false;
      }
    };
  }, [ride, socket, user]);

  const handleSubmit = () => {
    if (!user) {
      toast.error("User information is not available.");
      return;
    }

    if (!userLocation || !parkCenter) {
      toast.error("Unable to determine your location or park center.");
      return;
    }

    const distanceToPark = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      parkCenter.lat,
      parkCenter.lng,
    );

    if (distanceToPark > parkRadius) {
      toast.error("You must be inside the park to join the queue.");
      return;
    }

    const isUserInQueue = queue.some((item) => item.userId === user.name);
    if (isUserInQueue) {
      toast.error("You are already in the queue.");
      return;
    }
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
  };

  const handleRiderTypeChange = () => {
    setRiderType((prevType) => (prevType === "single" ? "multiple" : "single"));
  };

  const handleNumRidersChange = (e) => {
    setNumRiders(e.target.value);
  };

  const calculateArrivalTime = (position) => {
    if (!ride || !ride.avgProcessingTime)
      return { waitTime: null, formattedArrivalTime: null };

    const now = new Date();
    const waitTime = (position - 1) * ride.avgProcessingTime; // Wait time in minutes
    const arrivalTime = new Date(now.getTime() + waitTime * 60000); // Convert minutes to milliseconds

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

    return { waitTime, formattedArrivalTime };
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const queueInfo = queues[currentRideId] || {
    position: null,
    waitTime: null,
    formattedArrivalTime: null,
  };

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="queue-container">
      <h2>{ride ? ride.name : "Ride"}</h2>
      {user && (
        <p>
          {userPosition !== null
            ? `Thank you for joining ${user.name}, be patient while your turn comes.`
            : `Hi ${user.name}, join the queue!`}
        </p>
      )}
      {/* Display greeting message */}
      <div className="rider-type-toggle">
        <span>Single rider</span>
        <div
          className={`slider ${riderType === "multiple" ? "active" : ""}`}
          onClick={handleRiderTypeChange}
        ></div>
        <span>Multiple riders</span>
      </div>
      {riderType === "multiple" && (
        <input
          type="number"
          min="2"
          value={numRiders}
          onChange={handleNumRidersChange}
        />
      )}
      <button onClick={handleSubmit} disabled={loading}>
        Join Queue
      </button>
      {loading ? <div>Loading...</div> : <QueueList queue={queue} />}
      {userPosition !== null ? (
        <PositionInfo
          position={queueInfo.position}
          waitTime={queueInfo.waitTime}
          calculateArrivalTime={queueInfo.formattedArrivalTime}
        />
      ) : (
        <div>No position information available.</div>
      )}
    </div>
  );
};

export default RideQueue;
