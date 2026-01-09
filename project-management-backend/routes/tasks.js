const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { logActivity } = require("../controllers/activityController");

/**
 * =========================
 * GET ALL TASKS (ADMIN DASHBOARD)
 * =========================
 */
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const tasks = await Task.find()
      .populate("project", "title")
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch all tasks" });
  }
});

/**
 * =========================
 * GET MY TASKS (USER DASHBOARD)
 * =========================
 */
router.get("/my-tasks", protect, async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user._id,
    })
      .populate("project", "title")
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch my tasks" });
  }
});

/**
 * =========================
 * GET TASKS BY PROJECT
 * =========================
 */
router.get("/project/:projectId", protect, async (req, res) => {
  try {
    const filter = { project: req.params.projectId };

    if (req.user.role !== "admin") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

/**
 * =========================
 * CREATE TASK (ADMIN)
 * =========================
 */
router.post("/project/:projectId", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    let { title, description, assignedTo, priority, deadline } = req.body;

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!assignedTo) {
      assignedTo = req.user._id;
    }

    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = await Task.create({
      title,
      description,
      project: project._id,
      assignedTo,
      priority,
      deadline,
      status: "todo",
    });

    // ✅ ACTIVITY LOG
    await logActivity({
      user: req.user._id,
      action: `created task "${task.title}"`,
      project: project._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create task" });
  }
});

/**
 * =========================
 * UPDATE TASK (ADMIN / USER)
 * =========================
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const oldStatus = task.status;

    Object.assign(task, req.body);
    await task.save();

    // ✅ ACTIVITY LOG (status change)
    if (req.body.status && req.body.status !== oldStatus) {
      await logActivity({
        user: req.user._id,
        action: `changed task "${task.title}" to ${task.status}`,
        project: task.project,
      });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update task" });
  }
});

/**
 * =========================
 * DELETE TASK (ADMIN)
 * =========================
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    // ✅ ACTIVITY LOG
    await logActivity({
      user: req.user._id,
      action: `deleted task "${task.title}"`,
      project: task.project,
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

module.exports = router;