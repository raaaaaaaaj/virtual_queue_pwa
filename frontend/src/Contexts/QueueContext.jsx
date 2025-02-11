import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "../Hooks/useAuth";

const QueueContext = createContext();

export const useQueue = () => useContext(QueueContext);

export const QueueProvider = ({ children }) => {
  const { user } = useAuth();
  const [queues, setQueues] = useState({});

  // Load queues from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedQueues = localStorage.getItem(`queues_${user.id}`);
      setQueues(savedQueues ? JSON.parse(savedQueues) : {});
    } else {
      setQueues({});
    }
  }, [user]); // Trigger when user changes

  // Save queues to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`queues_${user.id}`, JSON.stringify(queues));
    }
  }, [queues, user]);

  const setQueueInfo = (rideId, queueInfo) => {
    setQueues((prevQueues) => ({
      ...prevQueues,
      [rideId]: queueInfo,
    }));
  };

  const refreshQueues = () => {
    if (user) {
      const savedQueues = localStorage.getItem(`queues_${user.id}`);
      setQueues(savedQueues ? JSON.parse(savedQueues) : {});
    }
  };

  return (
    <QueueContext.Provider value={{ queues, setQueueInfo, refreshQueues }}>
      {children}
    </QueueContext.Provider>
  );
};
