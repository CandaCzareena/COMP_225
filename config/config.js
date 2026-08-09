import dotenv from "dotenv";

// This must run before we read any process.env values below.
// In ESM, imports are hoisted (they run before any other code in the file),
// so dotenv.config() has to live INSIDE this module, not in server.js,
// to reliably populate process.env before other modules load.
dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  // Accept both names: .env commonly uses MONGO_URI; some setups use MONGODB_URI
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://" +
      (process.env.IP || "localhost") +
      ":" +
      (process.env.MONGO_PORT || "27017") +
      "/mernproject",
};

export default config;