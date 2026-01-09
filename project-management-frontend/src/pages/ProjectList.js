import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './ProjectList.css';

const ProjectList = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAllProjects();
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load projects');
      setLoading(false);
    }
  };

  const handleDelete = async (projectId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.deleteProject(projectId);
        setProjects(projects.filter(p => p._id !== projectId));
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  const filteredProjects = projects
    .filter(project => {
      if (filter === 'all') return true;
      return project.status === filter;
    })
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-screen">
          <div className="spinner"></div>
          <p className="loading-text">Loading projects...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="project-list-page">
        <div className="project-list-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">All Projects</h1>
              <p className="page-subtitle">Manage and organize your projects</p>
            </div>
            {isAdmin() && (
              <Link to="/projects/create" className="btn btn-primary">
                <span>+</span> Create Project
              </Link>
            )}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="filters-section">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'filter-btn-active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${filter === 'active' ? 'filter-btn-active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`filter-btn ${filter === 'completed' ? 'filter-btn-active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
              <button
                className={`filter-btn ${filter === 'on-hold' ? 'filter-btn-active' : ''}`}
                onClick={() => setFilter('on-hold')}
              >
                On Hold
              </button>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>
                {searchTerm 
                  ? 'No projects found' 
                  : filter === 'all' 
                    ? 'No projects yet' 
                    : `No ${filter} projects`}
              </h3>
              <p>
                {searchTerm
                  ? 'Try adjusting your search'
                  : 'Create your first project to get started'}
              </p>
              {isAdmin() && !searchTerm && (
                <Link to="/projects/create" className="btn btn-primary mt-2">
                  Create Project
                </Link>
              )}
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="project-card"
                >
                  <div className="project-card-header">
                    <h3 className="project-card-title">{project.name}</h3>
                    <div className="project-actions">
                      <span className={`status-badge status-${project.status}`}>
                        {project.status}
                      </span>
                      {isAdmin() && (
                        <button
                          onClick={(e) => handleDelete(project._id, e)}
                          className="btn-icon btn-delete"
                          title="Delete project"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="project-card-description">
                    {project.description || 'No description available'}
                  </p>

                  <div className="project-card-meta">
                    <div className="meta-item">
                      <span className="meta-icon">👥</span>
                      <span>{project.members?.length || 0} members</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">📋</span>
                      <span>{project.tasks?.length || 0} tasks</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {project.deadline && (
                    <div className="project-deadline">
                      <span className="deadline-icon">⏰</span>
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectList;
