import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../Styles/AdminPanel.css";
import useSocket from "../Hooks/useSocket";
import { GeolocationContext } from "../Contexts/GeolocationContext";

// Fix for default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const AdminPanel = () => {
  const [rides, setRides] = useState([]);
  const [rideName, setRideName] = useState("");
  const [rideDescription, setRideDescription] = useState("");
  const [rideImage, setRideImage] = useState("");
  const { socket } = useSocket();
  const { parkCenter, parkRadius, setParkCenter, setParkRadius } =
    useContext(GeolocationContext);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/rides");
      setRides(response.data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  const handleAddRide = async () => {
    try {
      const newRide = {
        name: rideName,
        description: rideDescription,
        image: rideImage,
      };
      await axios.post("http://localhost:8080/api/rides", newRide);
      toast.success("Ride added successfully");
      fetchRides();
      setRideName("");
      setRideDescription("");
      setRideImage("");
    } catch (error) {
      console.error("Error adding ride:", error);
      toast.error("Failed to add ride");
    }
  };

  const handlePopQueue = (rideId) => {
    socket.emit("dequeue", { rideId });
    toast.success("Customer popped from the queue");
  };

  const handleBulkJoin = (rideId) => {
    socket.emit("bulkJoinQueue", { rideId, baseName: "dummyUser" });
    toast.success("Dummy users added to the queue");
  };

  const handleSaveParkInfo = async () => {
    try {
      const parkInfo = {
        center: parkCenter,
        radius: parkRadius,
      };
      await axios.post("http://localhost:8080/api/park-info", parkInfo);
      toast.success("Park info saved successfully");
    } catch (error) {
      console.error("Error saving park info:", error);
      toast.error("Failed to save park info");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setParkCenter(e.latlng);
      },
    });

    return parkCenter === null ? null : (
      <Marker
        position={parkCenter}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            setParkCenter(position);
          },
        }}
      >
        <Circle center={parkCenter} radius={parkRadius} />
      </Marker>
    );
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="add-ride-form">
        <h3>Add New Ride</h3>
        <input
          type="text"
          placeholder="Ride Name"
          value={rideName}
          onChange={(e) => setRideName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ride Description"
          value={rideDescription}
          onChange={(e) => setRideDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ride Image URL"
          value={rideImage}
          onChange={(e) => setRideImage(e.target.value)}
        />
        <button onClick={handleAddRide}>Add Ride</button>
      </div>
      <div className="manage-queue">
        <h3>Manage Queue</h3>
        {rides.map((ride) => (
          <div key={ride.id} className="ride-item">
            <h4>{ride.name}</h4>
            <button onClick={() => handlePopQueue(ride.id)}>Pop Queue</button>
            <button onClick={() => handleBulkJoin(ride.id)}>
              Bulk Join Dummy Users
            </button>
          </div>
        ))}
      </div>
      <div className="map-container">
        <h3>Set Park Center and Radius</h3>
        {parkCenter && (
          <MapContainer
            center={parkCenter}
            zoom={15}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
          </MapContainer>
        )}
        <div className="radius-input">
          <label>Park Radius (meters):</label>
          <input
            type="number"
            value={parkRadius}
            onChange={(e) => setParkRadius(e.target.value)}
          />
        </div>
        <button onClick={handleSaveParkInfo}>Save Park Info</button>
      </div>
    </div>
  );
};

export default AdminPanel;
