import axios from "axios";

export const saveUserToQueue = async (name, fcmToken, position) => {
  console.log("saveUserToQueue called with:", { name, fcmToken, position });
  try {
    const response = await axios.post(
      "http://localhost:8080/api/add-to-queue",
      {
        name,
        fcmToken,
        position,
      },
    );
    console.log("Response from server:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};
