const Task = require("../models/Task");

/* ADMIN – create task */
exports.createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
};

/* PROJECT – get project tasks */
exports.getProjectTasks = async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId });
  res.json(tasks);
};

/* USER – get my assigned tasks ✅ NEW */
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user._id
    }).populate("project", "title");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to load tasks" });
  }
};