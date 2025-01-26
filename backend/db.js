const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/vq"; // Replace with your MongoDB connection string and database name

async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = { connectToDatabase, mongoose };
