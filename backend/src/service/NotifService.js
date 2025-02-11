const admin = require("../utils/firebase");

class NotifService {
  static async sendNotification(message) {
    try {
      const response = await admin.messaging().send({
        token: message.token,
        notification: {
          title: message.title,
          body: message.body,
        },
        data: {
          click_action: message.clickAction, // Include the click_action in the data payload
        },
      });
      console.log("Notification sent successfully:", response);
      return response;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }
}

module.exports = NotifService;
