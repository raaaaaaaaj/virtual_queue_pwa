import axios from "axios";

export const getQueueData = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/queue");
    console.log("Queue data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching queue data:", error);
    throw error;
  }
};
