import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/CustomerView.css";
import { requestFCMToken } from "../utils/firebaseUtils";

const CustomerView = () => {
  const [fcmToken, setFcmToken] = useState("");
  const [queues, setQueues] = useState([]); // Array of queue objects
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [ridesResponse, queuesResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/rides"),
          axios.get("http://localhost:8080/api/queueitems"), // Updated endpoint
        ]);

        setRides(ridesResponse.data);
        setQueues(queuesResponse.data); // Set the queues data directly
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

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
    const queue = queues.find((queue) => queue.rideId === rideId);
    return queue ? queue.estimatedWaitTime : 0; // Get estimated wait time from the queue object
  };

  const getQueueLength = (rideId) => {
    const queue = queues.find((queue) => queue.rideId === rideId);
    return queue ? queue.queueLength : 0; // Get queue length from the queue object
  };

  const handleViewQueue = (rideId) => {
    const selectedRide = rides.find((ride) => ride.id === rideId);
    navigate(`/queue/${rideId}`, { state: { ride: selectedRide, fcmToken } });
  };

  return (
    <div className="customer-view">
      <h2>Ride Queues</h2>
      <div className="rides-list">
        {loading ? (
          <div>Loading...</div>
        ) : (
          rides.map((ride) => {
            const queueLength = getQueueLength(ride.id); // Get queue length for the ride
            const waitTime = calculateWaitTime(ride.id); // Calculate wait time
            return (
              <div key={ride.id} className="ride-card">
                <img src={ride.image} alt={ride.name} className="ride-image" />
                <h3>{ride.name}</h3>
                <p>{ride.description}</p>
                <p>Number of people in queue: {queueLength}</p>
                <p>Estimated wait time: {waitTime} minutes</p>
                <button
                  className="view-button"
                  onClick={() => handleViewQueue(ride.id)}
                >
                  View Queue
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CustomerView;
