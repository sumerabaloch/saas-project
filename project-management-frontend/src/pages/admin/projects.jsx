import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectAPI } from "../../services/api";
import Navbar from "../../components/Navbar";
import "./projects.css";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectAPI.getAllProjects();
      setProjects(res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>Loading projects...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-projects">
        <div className="admin-projects-header">
          <h1>All Projects</h1>
          <Link to="/projects/create" className="btn btn-primary">
            + Create Project
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          <div className="admin-projects-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.name}</td>
                    <td>
                      <span className={`status ${project.status}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProjects;