import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Check if user is logged in and is admin
  if (!token || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
