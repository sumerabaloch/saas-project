const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const User = require("../models/User");

const { protect } = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

/**
 * =========================
 * GET ALL PROJECTS (for user)
 * =========================
 */
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

/**
 * =========================
 * GET SINGLE PROJECT
 * =========================
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (
      req.user.role !== "admin" &&
      project.owner._id.toString() !== req.user._id.toString() &&
      !project.members.some(m => m._id.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch project" });
  }
});

/**
 * =========================
 * CREATE PROJECT (ADMIN)
 * =========================
 */
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, status, deadline } = req.body;

    // ✅ Always pass members as an array
    const project = await Project.create({
      name,
      description,
      status,
      deadline,
      owner: req.user._id,
      members: [req.user._id] // Admin auto-added
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to create project" });
  }
});

/**
 * =========================
 * ADD MEMBER TO PROJECT (ADMIN)
 * =========================
 */
router.post("/:id/add-member", protect, adminOnly, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const project = await Project.findById(req.params.id);
    const user = await User.findById(userId);

    if (!project || !user) {
      return res.status(404).json({ message: "Project or User not found" });
    }

    // ✅ Ensure members is an array and contains only ObjectIds
    if (!Array.isArray(project.members)) {
      project.members = [];
    }

    const userIdStr = user._id.toString();
    if (!project.members.map(m => m.toString()).includes(userIdStr)) {
      project.members.push(user._id);
      await project.save();
    }

    res.json({
      message: "User assigned to project",
      project
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign user" });
  }
});

/**
 * =========================
 * DELETE PROJECT (ADMIN)
 * =========================
 */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project" });
  }
});

module.exports = router;