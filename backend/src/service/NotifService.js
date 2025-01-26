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
