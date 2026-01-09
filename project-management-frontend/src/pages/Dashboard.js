import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { projectAPI, taskAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      /* ======================
         ADMIN DASHBOARD
      ====================== */
      if (isAdmin()) {
        const projectRes = await projectAPI.getAllProjects();
        const projectData = projectRes.data || [];

        let completed = 0;
        let pending = 0;

        for (const project of projectData) {
          const taskRes = await taskAPI.getAllTasks(project._id);
          const projectTasks = taskRes.data || [];

          completed += projectTasks.filter(
            (t) => t.status === "done"
          ).length;

          pending += projectTasks.filter(
            (t) => t.status !== "done"
          ).length;
        }

        setProjects(projectData.slice(0, 4));
        setStats({
          totalProjects: projectData.length,
          completedTasks: completed,
          pendingTasks: pending,
        });
      }

      /* ======================
         USER DASHBOARD
      ====================== */
      else {
        const taskRes = await taskAPI.getMyTasks();
        const myTasks = taskRes.data || [];

        setTasks(myTasks);

        setStats({
          totalProjects: 0,
          completedTasks: myTasks.filter(
            (t) => t.status === "done"
          ).length,
          pendingTasks: myTasks.filter(
            (t) => t.status !== "done"
          ).length,
        });
      }

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>Loading dashboard...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <h2>Welcome, {user?.name}</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="stats">
          {isAdmin() && (
            <div className="stat-card">
              <h3>{stats.totalProjects}</h3>
              <p>Total Projects</p>
            </div>
          )}

          <div className="stat-card">
            <h3>{stats.completedTasks}</h3>
            <p>Completed Tasks</p>
          </div>

          <div className="stat-card">
            <h3>{stats.pendingTasks}</h3>
            <p>Pending Tasks</p>
          </div>
        </div>

        {/* ADMIN VIEW */}
        {isAdmin() && (
          <>
            <h3>Recent Projects</h3>

            {projects.length === 0 ? (
              <p>No projects found</p>
            ) : (
              <div className="project-list">
                {projects.map((p) => (
                  <Link key={p._id} to={`/projects/${p._id}`}>
                    <div className="project-card">
                      <h4>{p.title}</h4>
                      <p>Status: {p.status || "active"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* USER VIEW */}
        {!isAdmin() && (
          <>
            <h3>My Tasks</h3>

            {tasks.length === 0 ? (
              <p>No tasks assigned</p>
            ) : (
              <div className="task-list">
                {tasks.map((task) => (
                  <div key={task._id} className="task-card">
                    <h4>{task.title}</h4>
                    <p>Status: {task.status}</p>
                    <p>Project: {task.project?.title}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;