import config from "./config/config.js";
import app from "./server/express.js";
import mongoose from "mongoose";
import User from "./server/models/user.model.js";

mongoose.Promise = global.Promise;
const mongoOptions = {
  serverSelectionTimeoutMS: 15000,
};

if (process.env.NODE_ENV !== "production" && process.env.RENDER !== "true") {
  mongoOptions.family = 4;
}

if (!config.mongoUri) {
  console.error("MONGO_URI is missing. Set it in Render Environment variables.");
}

async function ensureBootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      name: process.env.ADMIN_NAME || "ColtCircle Admin",
      email,
      password,
      role: "admin",
      program: "Administration",
    });
    await user.save();
    console.log("Bootstrap admin created:", email);
    return;
  }

  if (user.role !== "admin") {
    user.role = "admin";
    user.updated = Date.now();
    await user.save();
    console.log("Promoted existing user to admin:", email);
  }
}

mongoose
  .connect(config.mongoUri, mongoOptions)
  .then(async () => {
    console.log("MongoDB Connected:", mongoose.connection.name);
    try {
      await ensureBootstrapAdmin();
    } catch (err) {
      console.error("Admin bootstrap failed:", err.message);
    }
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
