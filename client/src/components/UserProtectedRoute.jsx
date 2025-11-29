import React from 'react';
import { Navigate } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Check if user is logged in (any role)
  if (!token) {
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default UserProtectedRoute;
