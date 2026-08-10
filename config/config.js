import fs from "fs";
import dotenv from "dotenv";

// Local .env (dev). On Render, vars come from the dashboard Environment tab.
dotenv.config();

// Optional: if you used Render "Secret Files" named .env
if (fs.existsSync("/etc/secrets/.env")) {
  dotenv.config({ path: "/etc/secrets/.env", override: false });
}

const mongoUri =
  (process.env.MONGODB_URI || process.env.MONGO_URI || "").trim() ||
  "mongodb://" +
    (process.env.IP || "localhost") +
    ":" +
    (process.env.MONGO_PORT || "27017") +
    "/mernproject";

const usingAtlas = mongoUri.startsWith("mongodb+srv://") || mongoUri.includes("mongodb.net");

console.log(
  `[config] NODE_ENV=${process.env.NODE_ENV || "undefined"} | MONGO_URI set=${Boolean(
    (process.env.MONGODB_URI || process.env.MONGO_URI || "").trim()
  )} | JWT_SECRET set=${Boolean(process.env.JWT_SECRET)} | usingAtlas=${usingAtlas}`
);

if (
  (process.env.NODE_ENV === "production" || process.env.RENDER === "true") &&
  !usingAtlas
) {
  console.error(
    "[config] MONGO_URI is missing or not an Atlas URI. " +
      "In Render → Environment, add MONGO_URI=mongodb+srv://... then Save and redeploy."
  );
}

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri,
};

export default config;
