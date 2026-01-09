import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { activityAPI } from "../../services/api";
import "./activity.css";

const AdminActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    try {
      const res = await activityAPI.getAllActivity();
      setActivities(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load activity", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="admin-loading">Loading activity...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-activity">
        <h1>Activity Logs</h1>

        {activities.length === 0 ? (
          <p>No activity found</p>
        ) : (
          <ul className="activity-list">
            {activities.map((log) => (
              <li key={log._id} className="activity-item">
                <div className="activity-main">
                  <strong>{log.user?.name || "System"}</strong>{" "}
                  <span>{log.action}</span>
                </div>

                <div className="activity-meta">
                  <span>
                    {log.project?.name || "General"}
                  </span>
                  <span>
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default AdminActivity;