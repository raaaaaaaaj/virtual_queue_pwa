import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import "./QueueTest.css";
import { requestFCMToken } from "./utils/firebaseUtils";
import socket from "./utils/socketConnect";

function WaitTime({ queue, avgProcessingTime }) {
  const waitTime = queue.length > 0 ? queue.length * avgProcessingTime : 0;

  return (
    <div className="wait-time-container">
      <h3>Estimated Wait Time:</h3>
      <p className="wait-time">
        {waitTime > 0 ? `${waitTime} minutes` : "No wait time"}
      </p>
    </div>
  );
}

function QueueTest() {
  const [role, setRole] = useState("customer");
  const [queue, setQueue] = useState([]);
  const [name, setName] = useState("guest");
  const [socketConnected, setSocketConnected] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const [avgProcessingTime, setAvgProcessingTime] = useState(5); // Default to 5 minutes

  const toggleRole = () => {
    setRole((prevRole) => (prevRole === "customer" ? "admin" : "customer"));
  };

  const fetchNotifToken = async () => {
    try {
      const token = await requestFCMToken();
      setFcmToken(token);
      console.log(token);
    } catch (error) {
      console.error("Error fetching FCM token:", error);
    }
  };

  useEffect(() => {
    fetchNotifToken();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("setup", fcmToken);
      console.log("Connected to socket server");
    });

    socket.on("welcome", (data) => {
      console.log("Received welcome message:", data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      socket.off("connect");
      socket.off("welcome");
      socket.off("disconnect");
    };
  }, [socketConnected, fcmToken]);

  useEffect(() => {
    socket.on("userAdded", (data) => {
      console.log("User added to queue:", data);
      setQueue((prevQueue) => [...prevQueue, data]);
    });

    return () => {
      socket.off("userAdded");
    };
  }, []);

  useEffect(() => {
    socket.on("userPopped", (data) => {
      console.log("User popped from queue:", data.queue);
      setQueue(data.queue);

      // Update avgProcessingTime dynamically
      const { entryTime, exitTime } = data.poppedUser; // Assuming these timestamps are provided
      const processingTime = (exitTime - entryTime) / 60000; // Convert ms to minutes
      setAvgProcessingTime((prev) => (prev + processingTime) / 2);
    });

    return () => {
      socket.off("userPopped");
    };
  }, []);

  const handleClick = () => {
    if (name.trim() === "") {
      toast.error("Name cannot be empty!", {
        className: "toast-error",
      });
      return;
    }

    if (role === "customer") {
      socket.emit("addUserToQueue", { name, fcmToken });
      toast.success("Simulated joining the queue!", {
        className: "toast-success",
      });
    } else {
      socket.emit("popQueue", { adminName: name, queue });
      toast.success(`Simulated popping customers from the queue by ${name}!`, {
        className: "toast-success",
      });
    }
  };

  const formatArrivalTime = (minutes) => {
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + minutes * 60000);
    const windowStart = new Date(arrivalTime.getTime() - 2 * 60000);
    const windowEnd = new Date(arrivalTime.getTime() + 3 * 60000);

    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    return `${formatTime(windowStart)} - ${formatTime(windowEnd)}`;
  };

  return (
    <div className="container">
      <Toaster position="top-center" reverseOrder={false} />
      <label className="label">What are you?</label>
      <div className="slider-container">
        <div className="role-text">Customer</div>
        <div
          className={`slider ${role === "admin" ? "active" : ""}`}
          onClick={toggleRole}
        ></div>
        <div className="role-text">Admin</div>
      </div>
      <input
        type="text"
        className="name-input"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="button" onClick={handleClick}>
        {role === "customer" ? "Join Queue" : "Pop Customers"}
      </button>
      <div className="queue">
        <h3>Queue:</h3>
        <ul>
          {queue.map((item, index) => (
            <li key={index}>
              <p>Name: {item.name}</p>
              <p>
                Wait Time: {formatArrivalTime(avgProcessingTime * (index + 1))}
              </p>
            </li>
          ))}
        </ul>
        <WaitTime queue={queue} avgProcessingTime={avgProcessingTime} />
      </div>
    </div>
  );
}

export default QueueTest;
