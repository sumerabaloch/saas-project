import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./dashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    activeProjects: 0,
    completedTasks: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);

      // ✅ CORRECT ADMIN API
      const res = await api.get("/admin/stats");

      setStats({
        users: res.data.users,
        projects: res.data.projects,
        activeProjects: res.data.activeProjects || 0,
        completedTasks: res.data.completedTasks || 0,
      });

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading admin dashboard...</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h2>{stats.users}</h2>
          <p>Total Users</p>
        </div>

        <div className="admin-stat-card">
          <h2>{stats.projects}</h2>
          <p>Total Projects</p>
        </div>

        <div className="admin-stat-card">
          <h2>{stats.activeProjects}</h2>
          <p>Active Projects</p>
        </div>

        <div className="admin-stat-card">
          <h2>{stats.completedTasks}</h2>
          <p>Completed Tasks</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;