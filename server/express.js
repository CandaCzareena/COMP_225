import express from "express";
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

const app = express();

// 1. Global Security & Body Parsing Middleware (MUST BE BEFORE ROUTES)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors()); // Enables cross-origin requests from Vite (port 5173)

// 2. API Routes
app.use("/", userRoutes);
app.use("/", blogRoutes);
app.use("/", programRoutes);
app.use("/", schoolRoutes);
app.use("/", authRoutes);
app.use("/", itemRoutes);

// 3. Global Error Handler
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

export default app;