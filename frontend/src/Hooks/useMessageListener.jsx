// filepath: /d:/Proj/virtual-queue/frontend/src/hooks/useMessageListener.js
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { onMessageListener } from "../utils/firebaseUtils";

const useMessageListener = () => {
  useEffect(() => {
    const handleMessage = (payload) => {
      console.log("Message received. Payload:", payload);
      console.log(
        `Message received. Title: ${payload.notification.title} Body: ${payload.notification.body}`,
      );
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
  }, []);
};

export default useMessageListener;
