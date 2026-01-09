const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

// ================= DASHBOARD STATS =================
exports.dashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const projects = await Project.find();

    const activeProjects = projects.filter(
      (p) => p.status === "active"
    ).length;

    const completedTasks = await Task.countDocuments({
      status: "completed",
    });

    res.json({
      users: usersCount,
      projects: projects.length,
      activeProjects,
      completedTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};

// ================= GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to load users" });
  }
};

// ================= ASSIGN ROLE (ADMIN ONLY) =================
exports.assignUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign role" });
  }
};

// ================= ASSIGN TASK TO USER (ADMIN ONLY) =================
exports.assignTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      priority,
      deadline
    } = req.body;

    // check assigned user exists
    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      priority,
      deadline
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to assign task" });
  }
};