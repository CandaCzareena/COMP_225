import config from "./config/config.js";
import app from "./server/express.js";
import mongoose from "mongoose";

mongoose.Promise = global.Promise;
const mongoOptions = {
  serverSelectionTimeoutMS: 15000,
};

// On Windows local, prefer IPv4. On Render/cloud, let Node pick (family:4 can break DNS there).
if (process.env.NODE_ENV !== "production" && process.env.RENDER !== "true") {
  mongoOptions.family = 4;
}

if (!config.mongoUri) {
  console.error("MONGO_URI is missing. Set it in Render Environment variables.");
}

mongoose
  .connect(config.mongoUri, mongoOptions)
  .then(() => {
    console.log("MongoDB Connected:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    console.error(
      "Check MONGO_URI and Atlas Network Access (allow 0.0.0.0/0 for cloud hosts)."
    );
  });

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", config.port);
});
