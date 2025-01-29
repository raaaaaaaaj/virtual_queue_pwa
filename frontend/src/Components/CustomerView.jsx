import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/CustomerView.css";
import useSocket from "../context/useSocket";
import { requestFCMToken } from "../utils/firebaseUtils";

const CustomerView = () => {
  const [fcmToken, setFcmToken] = useState("");
  const [queues, setQueues] = useState({});
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    socket.on("globalQueueUpdate", (updatedQueue) => {
      setQueues((prevQueues) => ({
        ...prevQueues,
        [updatedQueue.rideId]: updatedQueue.queue,
      }));
      console.log("client:", updatedQueue);
    });

    return () => {
      socket.off("globalQueueUpdate");
    };
  }, [isConnected, socket]);

  const rides = [
    {
      id: 543453453453,
      name: "Roller Coaster",
      avgProcessingTime: 5,
      image: "https://picsum.photos/seed/roller_coaster/200/200",
    },
    {
      id: 2857456546345,
      name: "Ferris Wheel",
      avgProcessingTime: 7,
      image: "https://picsum.photos/seed/ferris_wheel/200/200",
    },
    {
      id: 3354345345255446,
      name: "Haunted Mansion",
      avgProcessingTime: 10,
      image: "https://picsum.photos/seed/haunted_mansion/200/200",
    },
  ];

  useEffect(() => {
    async function fetchNotifToken() {
      try {
        const token = await requestFCMToken();
        setFcmToken(token);
      } catch (error) {
        console.error("Error fetching FCM token:", error);
      }
    }
    fetchNotifToken();
  }, []);

  const calculateWaitTime = (rideId) => {
    const queue = queues[rideId] || [];
    const ride = rides.find((ride) => ride.id === rideId);
    return queue.length * ride.avgProcessingTime;
  };

  const handleViewQueue = (rideId) => {
    const selectedRide = rides.find((ride) => ride.id === rideId);
    navigate(`/queue/${rideId}`, { state: { ride: selectedRide, fcmToken } });
  };

  return (
    <div className="customer-view">
      <h2>Ride Queues</h2>
      <div className="rides-list">
        {rides.map((ride) => (
          <div key={ride.id} className="ride-card">
            <img src={ride.image} alt={ride.name} className="ride-image" />
            <h3>{ride.name}</h3>
            <p>Wait Time: {calculateWaitTime(ride.id)} minutes</p>
            <button
              className="view-button"
              onClick={() => handleViewQueue(ride.id)}
            >
              View Queue
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerView;
