import React, { useState, useEffect } from "react";
import { activityAPI } from "../services/api";
import Navbar from "../components/Navbar";
import "./ActivityLog.css";

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      // ✅ CORRECT API FUNCTION
      const response = await activityAPI.getMyActivities();

      console.log("Activity API response:", response.data);

      // ✅ HANDLE BOTH POSSIBLE BACKEND RESPONSES
      const activityData = Array.isArray(response.data)
        ? response.data
        : response.data.activities || [];

      setActivities(activityData);
      setError("");
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Failed to load activity");
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "project_created":
        return "➕";
      case "project_updated":
        return "✏️";
      case "task_created":
        return "📝";
      case "task_updated":
        return "🔄";
      case "task_completed":
        return "✅";
      case "member_added":
        return "👥";
      default:
        return "📌";
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return activityDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-screen">
          <div className="spinner"></div>
          <p className="loading-text">Loading activity...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="activity-page">
        <div className="activity-container">
          <div className="page-header">
            <h1 className="page-title">Activity Log</h1>
            <p className="page-subtitle">
              Track all project and task activities
            </p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {activities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No activity yet</h3>
              <p>Activity will appear here as you work on projects</p>
            </div>
          ) : (
            <div className="activity-timeline">
              {activities.map((activity) => (
                <div
                  key={activity._id || activity.id}
                  className="activity-item"
                >
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      <strong>{activity.user?.name || "User"}</strong>{" "}
                      {activity.action}
                    </p>
                    {activity.details && (
                      <p className="activity-details">
                        {activity.details}
                      </p>
                    )}
                    <span className="activity-time">
                      {formatTime(activity.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ActivityLog;