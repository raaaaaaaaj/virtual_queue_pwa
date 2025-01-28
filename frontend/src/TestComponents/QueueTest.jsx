import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import "./QueueTest.css";
import { requestFCMToken } from "../utils/firebaseUtils";
// import { saveUserToQueue } from "./utils/SaveApiUtils";
// import { getQueueData } from "./utils/QueueApiUtils";
// const ENDPOINT = "http://localhost:8080";
import socket from "../utils/socketConnect";
function WaitTime() {
  return (
    <div className="wait-time-container">
      <h3>Estimated Wait Time:</h3>
      <p className="wait-time">Calculating...</p>
    </div>
  );
}

function QueueTest() {
  const [role, setRole] = useState("customer");
  const [queue, setQueue] = useState([]);
  const [name, setName] = useState("guest");
  const [socketConnected, setSocketConnected] = useState(false);
  const [fcmToken, setFcmToken] = useState("");

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

  // const fetchQueueData = async () => {
  //   try {
  //     const data = await getQueueData();
  //     setQueue(data);
  //   } catch (error) {
  //     console.error("Error fetching queue data:", error);
  //   }
  // };

  useEffect(() => {
    fetchNotifToken();
    // fetchQueueData();
  }, []);
  useEffect(() => {
    socket.on("connect", () => {
      setSocketConnected((is) => !is);
      socket.emit("setup", fcmToken);
      console.log("Connected to socket server");
    });

    socket.on("welcome", (data) => {
      console.log("Received welcome message:", data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    // Add more socket event listeners as needed

    return () => {
      socket.off("connect");
      socket.off("welcome");
      socket.off("disconnect");
      // Remove other event listeners if added
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
  }, [queue]);

  useEffect(() => {
    socket.on("userPopped", (data) => {
      console.log("User popped from queue:", data.queue);
      setQueue(data.queue);
    });
    return () => {
      socket.off("userPopped");
    };
  }, [queue]);
  // const handleSaveUser = async () => {
  //   try {
  //     const response = await saveUserToQueue(name, fcmToken, 1);
  //     console.log("User saved:", response);
  //     fetchQueueData(); // Refresh the queue data after saving a user
  //   } catch (error) {
  //     console.error("Error saving user:", error);
  //   }
  // };

  const handleClick = () => {
    if (name.trim() === "") {
      toast.error("Name cannot be empty!", {
        className: "toast-error",
      });
      return;
    }

    if (role === "customer") {
      socket.emit("addUserToQueue", { name, fcmToken });
      // handleSaveUser();
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
              {/* <p>FCM Token: {item.user.fcmToken}</p>
              <p>Position: {item.position}</p> */}
            </li>
          ))}
        </ul>
        <WaitTime />
      </div>
    </div>
  );
}

export default QueueTest;
