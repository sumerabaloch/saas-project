const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo"
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    deadline: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);