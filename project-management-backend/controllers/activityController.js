const Activity = require("../models/Activity");

/**
 * =========================
 * GET ACTIVITIES
 * Admin → all
 * User → own
 * =========================
 */
exports.getActivities = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let activities = [];

    if (req.user.role === "admin") {
      activities = await Activity.find()
        .populate("user", "name email role")
        .populate("project", "name")
        .sort({ createdAt: -1 });
    } else {
      activities = await Activity.find({ user: req.user._id })
        .populate("user", "name email")
        .populate("project", "name")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(activities);
  } catch (error) {
    console.error("Activity fetch error:", error);
    res.status(500).json({
      message: "Failed to load activity",
    });
  }
};

/**
 * =========================
 * LOG ACTIVITY (HELPER)
 * =========================
 */
exports.logActivity = async ({ user, action, project }) => {
  try {
    if (!user || !action) return;

    await Activity.create({
      user,
      action,
      project: project || null,
    });
  } catch (error) {
    console.error("Activity log error:", error.message);
  }
};