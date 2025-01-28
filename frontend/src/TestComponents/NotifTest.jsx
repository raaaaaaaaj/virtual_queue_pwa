import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import "./App.css";
import { requestFCMToken, onMessageListener } from "../utils/firebaseUtils";

export default function App() {
  const [count, setCount] = useState(0);
  const [fcmToken, setFcmToken] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    async function fetchNotifToken() {
      try {
        const token = await requestFCMToken();
        setFcmToken(token);
        console.log(token);
      } catch (error) {
        console.error("Error fetching FCM token:", error);
      }
    }
    fetchNotifToken();
  }, []);

  const handleMessage = (payload) => {
    console.log("Message received. Title:", payload.notification);
    toast.success(
      <div>
        <strong>{payload.notification.title}</strong>
        <div>{payload.notification.body}</div>
      </div>,
      {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
      },
    );
    // Reinitialize the listener for subsequent messages
    initializeMessageListener();
  };

  const initializeMessageListener = () => {
    onMessageListener()
      .then(handleMessage)
      .catch((err) => console.error("Failed to receive message:", err));
  };

  // Initialize the listener for the first time
  initializeMessageListener();

  const handleClick = async () => {
    setCount(count + 1);
    console.log(count + 1);

    const data = {
      title: "Firebase",
      body: "Hello from api",
      devicetoken: fcmToken,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/firebase/send",
        data,
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
  };

  const toggleNotifications = async () => {
    setNotificationsEnabled((prev) => !prev);
    try {
      const token = await requestFCMToken();
      setFcmToken(token);
      toast.success(
        `Notifications ${notificationsEnabled ? "disabled" : "enabled"}!`,
        {
          className: "toast-success",
        },
      );
    } catch (error) {
      toast.error("Error fetching FCM token!", {
        className: "toast-error",
      });
      console.error("Error fetching FCM token:", error);
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <button className="notification-button" onClick={toggleNotifications}>
        <FaBell
          className={`bell-icon ${notificationsEnabled ? "enabled" : ""}`}
        />
        <span className="notification-text">Notifications</span>
      </button>
      <button onClick={handleClick}>Increment</button>
      <p>Count: {count}</p>
    </div>
  );
}
