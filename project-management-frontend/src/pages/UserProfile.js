import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await userAPI.updateProfile(updateData);
      setSuccess('Profile updated successfully');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <div className="page-header">
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">Manage your account settings</p>
          </div>

          <div className="profile-content">
            <div className="profile-sidebar">
              <div className="user-avatar-large">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="user-name-large">{user?.name}</h2>
              <p className="user-email-large">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="admin-badge-large">Administrator</span>
              )}
            </div>

            <div className="profile-main">
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-section">
                  <h3 className="form-section-title">Basic Information</h3>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Change Password</h3>
                  <p className="form-section-subtitle">Leave blank if you don't want to change your password</p>

                  <div className="form-group">
                    <label className="form-label" htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      className="form-control"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="form-control"
                      value={formData.newPassword}
                      onChange={handleChange}
                      minLength="6"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      minLength="6"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
