const NotifService = require("../service/NotifService");

const sendNotification = async (req, res) => {
  try {
    const { devicetoken, title, body } = req.body;
    if (!devicetoken) {
      return res
        .status(400)
        .json({ message: "Device token is required", success: false });
    }
    const message = { token: devicetoken, title, body };
    await NotifService.sendNotification(message);
    res
      .status(200)
      .json({ message: "Notification sent successfully", success: true });
  } catch (error) {
    console.error("Error sending notification:", error);
    res
      .status(500)
      .json({ message: "Error sending notification", success: false });
  }
};

module.exports = sendNotification;
