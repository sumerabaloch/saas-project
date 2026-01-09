import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import ActivityLog from './pages/ActivityLog';
import UserProfile from './pages/UserProfile';

// Admin Pages
import AdminDashboard from './pages/admin/dashboard';
import AdminProjects from './pages/admin/projects';
import AdminUsers from './pages/admin/users';
import AdminActivity from './pages/admin/activity';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:projectId"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/create"
            element={
              <ProtectedRoute adminOnly>
                <CreateProject />
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <ActivityLog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* 🔑 ADMIN ROUTES (MUST BE INSIDE ROUTES) */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/projects"
            element={
              <AdminRoute>
                <AdminProjects />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/activity"
            element={
              <AdminRoute>
                <AdminActivity />
              </AdminRoute>
            }
          />

          {/* Default */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;