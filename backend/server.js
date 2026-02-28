const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security headers
app.use(helmet());

// Body size limit (prevents memory exhaustion attacks)
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Logging — concise in production, verbose in dev
const morgan = require("morgan");
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts, please try again after 15 minutes." },
});
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: "Too many messages sent, please try again later." },
});
app.use("/api", generalLimiter);

// CORS — explicitly allow production + local origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:3000",
  "https://ilmify.online",
  "https://www.ilmify.online",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes (with specific rate limits on sensitive endpoints)
app.use("/api/auth", authLimiter, require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/classes", require("./routes/class.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/meet", require("./routes/meet.routes"));
app.use("/api/contact", contactLimiter, require("./routes/contact.routes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Ilmify API is running" });
});

// Error handling middleware
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
  // Force close after 10s
  setTimeout(() => process.exit(1), 10000);
};
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
