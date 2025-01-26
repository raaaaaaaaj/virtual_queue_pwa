const { mongoose } = require("../db");

const userSchema = new mongoose.Schema({
  name: String,
  fcmToken: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
