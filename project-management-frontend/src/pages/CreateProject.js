import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './CreateProject.css';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await projectAPI.createProject(formData);
      navigate(`/projects/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-project-page">
        <div className="create-project-container">
          <div className="page-header">
            <h1 className="page-title">Create New Project</h1>
            <p className="page-subtitle">Fill in the details to create your project</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="create-project-card">
            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Project Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  placeholder="Enter project description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="deadline">Deadline</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    className="form-control"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProject;
