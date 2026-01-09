import React, { useEffect, useState } from "react";
import { taskAPI, userAPI } from "../services/api";
import "./CreateTaskModal.css";

const CreateTaskModal = ({ projectId, onClose, onTaskCreated }) => {
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "", // ✅ IMPORTANT
    status: "todo",
    priority: "medium",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     LOAD USERS (ADMIN)
  ========================= */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.assignedTo) {
      setError("Please assign task to a user");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await taskAPI.createTask(projectId, formData);
      onTaskCreated(response.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Task</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-body">
          {/* TITLE */}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* ASSIGN USER ✅ */}
          <div className="form-group">
            <label className="form-label">Assign To *</label>
            <select
              name="assignedTo"
              className="form-control"
              value={formData.assignedTo}
              onChange={handleChange}
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* STATUS + PRIORITY */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* DEADLINE */}
          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              type="date"
              name="deadline"
              className="form-control"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          {/* ACTIONS */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;