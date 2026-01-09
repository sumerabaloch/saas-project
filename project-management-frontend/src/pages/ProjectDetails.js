import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { projectAPI, taskAPI } from "../services/api";
import Navbar from "../components/Navbar";
import TaskBoard from "../components/TaskBoard";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateTask, setShowCreateTask] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
    // eslint-disable-next-line
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);

      const [projectRes, taskRes] = await Promise.all([
        projectAPI.getProject(projectId),
        taskAPI.getAllTasks(projectId),
      ]);

      setProject(projectRes.data);
      setTasks(taskRes.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("Delete this project permanently?")) return;

    try {
      await projectAPI.deleteProject(projectId);
      navigate("/projects");
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  const handleTaskCreated = (task) => {
    setTasks((prev) => [...prev, task]);
    setShowCreateTask(false);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  const handleTaskDeleted = (taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>Loading project...</p>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px", color: "red" }}>
          {error || "Project not found"}
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="project-details">
        <div className="project-header">
          <div>
            <div className="breadcrumb">
              <Link to="/projects">Projects</Link> ›{" "}
              <span>{project.title}</span>
            </div>

            <h1>{project.title}</h1>
            <p>{project.description}</p>

            <div className="project-meta">
              <span>Status: {project.status || "active"}</span>
              <span>Tasks: {tasks.length}</span>
            </div>
          </div>

          <div className="project-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateTask(true)}
            >
              + Add Task
            </button>

            {isAdmin() && (
              <button
                className="btn btn-danger"
                onClick={handleDeleteProject}
              >
                Delete Project
              </button>
            )}
          </div>
        </div>

        <TaskBoard
          projectId={projectId}
          tasks={tasks}
          onTaskCreated={handleTaskCreated}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
          showCreateTask={showCreateTask}
          setShowCreateTask={setShowCreateTask}
        />
      </div>
    </>
  );
};

export default ProjectDetails;