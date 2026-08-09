import config from "./config/config.js";
import app from "./server/express.js";
import mongoose from "mongoose";

mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoUri, {
    serverSelectionTimeoutMS: 10000,
    family: 4,
  })
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
