const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 👇 THIS IS WHY members shows as empty array
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    status: {
      type: String,
      default: "active"
    },

    deadline: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);