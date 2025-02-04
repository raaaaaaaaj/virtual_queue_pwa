const NotifService = require("../service/NotifService");

const sendNotification = async ({ devicetoken, title, body }) => {
  try {
    if (!devicetoken) {
      throw new Error("Device token is required");
    }
    const message = { token: devicetoken, title, body };
    await NotifService.sendNotification(message);
    return { message: "Notification sent successfully", success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { message: "Error sending notification", success: false };
  }
};

module.exports = sendNotification;
