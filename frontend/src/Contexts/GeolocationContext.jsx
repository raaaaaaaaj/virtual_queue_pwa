import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const GeolocationContext = createContext();

export const GeolocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [parkCenter, setParkCenter] = useState(null);
  const [parkRadius, setParkRadius] = useState(1000); // Default radius in meters

  useEffect(() => {
    // Fetch park center and radius from the backend
    const fetchParkInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/park-info");
        setParkCenter(response.data.center);
        setParkRadius(response.data.radius);
      } catch (error) {
        console.error("Error fetching park info:", error);
      }
    };

    fetchParkInfo();
  }, []);

  useEffect(() => {
    // Get user's current location
    const getUserLocation = () => {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              console.log("User location:", location); // Log user location
              resolve(location);
            },
            (error) => {
              reject(error);
            },
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });
    };

    getUserLocation()
      .then((location) => setUserLocation(location))
      .catch((error) => console.error("Error getting user location:", error));
  }, []);

  return (
    <GeolocationContext.Provider
      value={{
        userLocation,
        parkCenter,
        parkRadius,
        setParkCenter,
        setParkRadius,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
};
