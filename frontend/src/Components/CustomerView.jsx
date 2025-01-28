import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import "../Styles/CustomerView.css";

const CustomerView = () => {
  // Sample data for rides and their queues
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

  const navigate = useNavigate(); // Initialize useNavigate

  // Handle navigating to the Queue component
  const handleViewQueue = (rideId) => {
    const selectedRide = rides.find((ride) => ride.id === rideId);
    navigate(`/queue/${rideId}`, { state: { ride: selectedRide } }); // Pass ride data as state
  };

  return (
    <div className="customer-view">
      <h2>Ride Queues</h2>
      <div className="rides-list">
        {rides.map((ride) => (
          <div key={ride.id} className="ride-card">
            <img src={ride.image} alt={ride.name} className="ride-image" />
            <h3>{ride.name}</h3>
            <p>Wait Time: minutes</p>
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
