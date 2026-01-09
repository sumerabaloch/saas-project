import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="register-content">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Create Account</h1>
            <p className="register-subtitle">Join us and start managing your projects</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="John Doe"
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
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="register-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="register-features">
          <h2 className="features-title">Why Choose ProjectHub?</h2>
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">🚀</div>
              <div className="feature-content">
                <h3>Boost Productivity</h3>
                <p>Streamline workflows and get more done in less time</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">👥</div>
              <div className="feature-content">
                <h3>Team Collaboration</h3>
                <p>Work together seamlessly with your entire team</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div className="feature-content">
                <h3>Track Progress</h3>
                <p>Monitor project status and deadlines in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
