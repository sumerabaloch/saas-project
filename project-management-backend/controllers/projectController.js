const Project = require("../models/Project");

/* CREATE PROJECT */
exports.createProject = async (req, res) => {
  const project = await Project.create({
    ...req.body,
    owner: req.user._id,
    members: [req.user._id]
  });
  res.json(project);
};

/* GET PROJECTS */
exports.getProjects = async (req, res) => {
  const projects = await Project.find({ members: req.user._id });
  res.json(projects);
};

/* ✅ ASSIGN USER TO PROJECT (NEW) */
exports.assignUser = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // prevent duplicate
    if (project.members.includes(userId)) {
      return res.status(400).json({ message: "User already assigned" });
    }

    project.members.push(userId);
    await project.save();

    res.json({ message: "User assigned successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to assign user" });
  }
};