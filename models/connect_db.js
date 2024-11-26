// Import mongoose
const mongoose = require("mongoose");

// Connection URI
const uri =
  "mongodb+srv://developementdiginamicit:YBEwuhqBdDWOacpX@cluster0.3jduj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB: " + err.message);
  }
};

module.exports = connectDB;
