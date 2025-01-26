const User = require("../../models/UserSchema");

const saveUser = async (req, res) => {
  try {
    const { name, fcmToken } = req.body;
    if (name && fcmToken) {
      console.log("Received name:", name);
      console.log("Received FCM token:", fcmToken);

      // Save the user to the database using Mongoose
      const newUser = new User({ name, fcmToken });
      await newUser.save();
      console.log("User saved to database");

      res.status(200).json({ message: "User received and saved successfully" });
    } else {
      console.error("Name or FCM token is missing in the request body");
      res.status(400).json({ message: "Name or FCM token is missing" });
    }
  } catch (error) {
    console.error("Error processing /save-user request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { saveUser };
