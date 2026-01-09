const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");

dotenv.config();

const app = express();

// ===== Middlewares =====
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());

// ===== Routes IMPORT =====
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");
const adminRoutes = require("./routes/admin");
const activityRoutes = require("./routes/activityRoutes");

// ===== Routes USE =====
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/activity", activityRoutes); // ✅ FIXED (SINGULAR)

// ===== Test Route =====
app.get("/api", (req, res) => {
  res.json({
    status: "OK",
    message: "ProjectHub API is running 🚀",
  });
});

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ===== Server =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});