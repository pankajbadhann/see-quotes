const mongoose = require("mongoose");
const logger = require("../utils/logger.js");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info("Server starting...");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);

    // crash app safely (production standard)
    process.exit(1);
  }
};

module.exports = connectDB;