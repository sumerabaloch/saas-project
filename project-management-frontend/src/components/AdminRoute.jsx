import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // wait for auth to load

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but not admin
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Admin allowed
  return children;
};

export default AdminRoute;