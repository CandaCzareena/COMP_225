import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import programRoutes from "./routes/program.routes.js";
import schoolRoutes from "./routes/school.routes.js";
import authRoutes from "./routes/auth.routes.js";
import itemRoutes from "./routes/item.routes.js";
import messageRoutes from "./routes/message.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd =
  process.env.NODE_ENV === "production" || process.env.RENDER === "true";

const app = express();

// 1. Global Security & Body Parsing Middleware (MUST BE BEFORE ROUTES)
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());
app.use(compress());
app.use(
  helmet({
    contentSecurityPolicy: false, // allow Vite assets + profile photo data URLs
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors());

// 2. API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "ColtCircle" });
});
app.use("/", userRoutes);
app.use("/", blogRoutes);
app.use("/", programRoutes);
app.use("/", schoolRoutes);
app.use("/", authRoutes);
app.use("/", itemRoutes);
app.use("/", messageRoutes);

// 3. Production: serve React build from the same server
if (isProd) {
  const clientDist = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get(/^(?!\/api(?:\/|$)|\/auth(?:\/|$)).*/, (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// 4. Global Error Handler
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

export default app;
