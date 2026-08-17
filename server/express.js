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
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import { uploadDir } from "./middleware/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd =
  process.env.NODE_ENV === "production" || process.env.RENDER === "true";

const app = express();

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());
app.use(compress());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors());
app.use("/uploads", express.static(uploadDir));

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
app.use("/", adminRoutes);
app.use("/", uploadRoutes);
app.use("/", notificationRoutes);

if (isProd) {
  const clientDist = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get(/^(?!\/api(?:\/|$)|\/auth(?:\/|$)|\/uploads(?:\/|$)).*/, (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

export default app;
